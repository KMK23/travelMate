import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocationBased } from "../store/slices/locationBasedSlice";
import noImage from "../images/noimage.png";
import "./NearbyAttractions.scss";

const contentTypeMap = {
  12: "관광지",
  14: "문화시설",
  15: "축제공연행사",
  25: "여행코스",
  28: "레포츠",
  32: "숙박",
  38: "쇼핑",
  39: "음식점",
};

const NearbyAttractions = () => {
  const dispatch = useDispatch();
  const locationBasedList = useSelector(
    (state) => state.locationBased?.items || []
  );
  const status = useSelector((state) => state.locationBased?.status || "idle");
  const error = useSelector((state) => state.locationBased?.error || null);
  const [selectedTab, setSelectedTab] = useState("12"); // 기본값은 관광지
  const isFirstRender = useRef(true);
  const prevTabRef = useRef(selectedTab);

  // 초기 데이터 로드
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      dispatch(
        fetchLocationBased({
          mapX: "126.5311884",
          mapY: "33.4996213",
          radius: "5000",
          contentTypeId: selectedTab,
        })
      );
    }
  }, []); // 빈 의존성 배열

  // 탭 변경 시 데이터 로드
  useEffect(() => {
    if (!isFirstRender.current && selectedTab !== prevTabRef.current) {
      console.log("Tab changed from", prevTabRef.current, "to", selectedTab);
      prevTabRef.current = selectedTab;
      dispatch(
        fetchLocationBased({
          mapX: "126.5311884",
          mapY: "33.4996213",
          radius: "5000",
          contentTypeId: selectedTab,
        })
      );
    }
  }, [selectedTab, dispatch]);

  const handleTabChange = useCallback((tabId) => {
    console.log("Tab clicked:", tabId);
    setSelectedTab(String(tabId));
  }, []);

  if (status === "loading") return <div className="loading">로딩 중...</div>;
  if (status === "failed") return <div className="error">{error}</div>;

  return (
    <div className="nearby-attractions">
      <h2 className="section-title">제주도 인기 관광지</h2>
      <div className="tabs-container">
        <div className="tabs">
          {Object.entries(contentTypeMap).map(([id, name]) => (
            <button
              key={id}
              className={`tab ${selectedTab === id ? "active" : ""}`}
              onClick={() => handleTabChange(id)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="attractions-grid">
        {locationBasedList && locationBasedList.length > 0 ? (
          locationBasedList.map((item) => (
            <div key={item.contentid} className="attraction-card">
              <div className="attraction-image">
                <img
                  src={item.firstimage || noImage}
                  alt={item.title}
                  className={!item.firstimage ? "no-image" : ""}
                />
              </div>
              <div className="attraction-info">
                <h3>{item.title}</h3>
                <p className="address">{item.addr1}</p>
                {item.tel && <p className="tel">{item.tel}</p>}
              </div>
            </div>
          ))
        ) : (
          <p className="no-data">데이터가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default NearbyAttractions;
