import React, { useState, useEffect } from "react";
import KakaoMap from "../components/KakaoMap";
import axios from "axios";
import "./LocationBased.scss";

const LocationBased = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 날씨 정보 가져오기
  const fetchWeather = async (lat, lon) => {
    try {
      const API_KEY = "aa3d847d0a3833601e2ba4978af80d3e";
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error("날씨 정보를 가져오는데 실패했습니다:", error);
      setError("날씨 정보를 불러올 수 없습니다.");
    }
  };

  // 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          fetchWeather(latitude, longitude);
          setLoading(false);
        },
        (error) => {
          console.error("위치 정보를 가져오는데 실패했습니다:", error);
          setError("위치 정보를 불러올 수 없습니다.");
          setLoading(false);
        }
      );
    } else {
      setError("이 브라우저에서는 위치 정보를 사용할 수 없습니다.");
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="location-based">
      <div className="location-header">
        <h1>내 주변 관광지</h1>
      </div>

      <div className="location-content">
        <div className="map-wrapper">
          <KakaoMap currentLocation={currentLocation} />
        </div>

        {weatherData && (
          <div className="weather-container">
            <h2>현재 날씨</h2>
            <div className="weather-info">
              <img
                src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
                alt="날씨 아이콘"
              />
              <div className="weather-details">
                <p>기온: {Math.round(weatherData.main.temp)}°C</p>
                <p>체감온도: {Math.round(weatherData.main.feels_like)}°C</p>
                <p>습도: {weatherData.main.humidity}%</p>
                <p>풍속: {weatherData.wind.speed}m/s</p>
                <p>날씨: {weatherData.weather[0].description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationBased;
