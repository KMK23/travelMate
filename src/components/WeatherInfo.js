import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";

const WeatherInfo = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 현재 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`
            );

            if (!response.ok) {
              throw new Error("날씨 정보를 가져오는데 실패했습니다.");
            }

            const data = await response.json();
            setWeather(data);
            setLoading(false);
          } catch (err) {
            setError(err.message);
            setLoading(false);
          }
        },
        (err) => {
          setError("위치 정보를 가져오는데 실패했습니다.");
          setLoading(false);
        }
      );
    } else {
      setError("이 브라우저에서는 위치 정보를 사용할 수 없습니다.");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Card className="weather-card">
        <Card.Body>
          <p className="text-center">날씨 정보를 불러오는 중...</p>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="weather-card">
        <Card.Body>
          <p className="text-center text-danger">{error}</p>
        </Card.Body>
      </Card>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <Card className="weather-card">
      <Card.Header className="bg-primary text-white">
        <h3 className="mb-0">현재 날씨</h3>
      </Card.Header>
      <Card.Body>
        <div className="text-center">
          <h4>{weather.name}</h4>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <h2>{Math.round(weather.main.temp)}°C</h2>
          <p>{weather.weather[0].description}</p>
          <div className="weather-details">
            <p>체감온도: {Math.round(weather.main.feels_like)}°C</p>
            <p>습도: {weather.main.humidity}%</p>
            <p>풍속: {weather.wind.speed}m/s</p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default WeatherInfo;
