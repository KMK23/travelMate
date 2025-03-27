import React, { useEffect, useState } from "react";

const KakaoMap = ({ currentLocation }) => {
  const [map, setMap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeMap = () => {
      try {
        const container = document.getElementById("map");
        if (!container) {
          console.error("맵 컨테이너를 찾을 수 없습니다.");
          return;
        }

        if (!window.kakao?.maps) {
          console.error("카카오맵 SDK가 로드되지 않았습니다.");
          return;
        }

        const options = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 3,
        };

        const kakaoMap = new window.kakao.maps.Map(container, options);
        setMap(kakaoMap);
        setIsLoading(false);

        if (currentLocation) {
          const moveLatLon = new window.kakao.maps.LatLng(
            currentLocation.lat,
            currentLocation.lng
          );
          kakaoMap.setCenter(moveLatLon);

          const marker = new window.kakao.maps.Marker({
            position: moveLatLon,
          });
          marker.setMap(kakaoMap);

          const iwContent = '<div style="padding:5px;">현재 위치</div>';
          const infowindow = new window.kakao.maps.InfoWindow({
            content: iwContent,
          });
          infowindow.open(kakaoMap, marker);
        }
      } catch (error) {
        console.error("맵 초기화 중 오류가 발생했습니다:", error);
        setIsLoading(false);
      }
    };

    // window.kakao 객체가 로드될 때까지 대기
    const waitForKakao = setInterval(() => {
      if (window.kakao?.maps) {
        clearInterval(waitForKakao);
        initializeMap();
      }
    }, 100);

    return () => {
      clearInterval(waitForKakao);
      if (map) {
        setMap(null);
      }
    };
  }, [currentLocation, map]);

  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "500px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f8f9fa",
        display: isLoading ? "flex" : "block",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isLoading && "지도를 불러오는 중..."}
    </div>
  );
};

export default KakaoMap;
