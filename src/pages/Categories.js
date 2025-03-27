import React, { useState } from "react";
import "./Categories.scss";

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("all");

  const categories = [
    { id: "all", name: "전체" },
    { id: "nature", name: "자연" },
    { id: "culture", name: "문화" },
    { id: "food", name: "맛집" },
    { id: "activity", name: "액티비티" },
    { id: "healing", name: "힐링" },
  ];

  const seasons = [
    { id: "all", name: "전체 계절" },
    { id: "spring", name: "봄" },
    { id: "summer", name: "여름" },
    { id: "fall", name: "가을" },
    { id: "winter", name: "겨울" },
  ];

  const themes = [
    {
      title: "제주 봄 꽃길 여행",
      description: "봄에 피는 유채꽃, 벚꽃 등을 만날 수 있는 코스",
      season: "spring",
      category: "nature",
    },
    {
      title: "여름 해변 액티비티",
      description: "서핑, 스노클링 등 해양 활동이 가능한 장소",
      season: "summer",
      category: "activity",
    },
    {
      title: "가을 올레길 트레킹",
      description: "단풍과 함께하는 제주 올레길 코스",
      season: "fall",
      category: "healing",
    },
  ];

  return (
    <div className="categories-page">
      <div className="categories-header">
        <h1>카테고리별 추천</h1>

        <div className="filter-section">
          <div className="category-filters">
            <h3>카테고리</h3>
            <div className="filter-buttons">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={selectedCategory === category.id ? "active" : ""}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="season-filters">
            <h3>계절별</h3>
            <div className="filter-buttons">
              {seasons.map((season) => (
                <button
                  key={season.id}
                  className={selectedSeason === season.id ? "active" : ""}
                  onClick={() => setSelectedSeason(season.id)}
                >
                  {season.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="themes-grid">
        {themes
          .filter(
            (theme) =>
              (selectedCategory === "all" ||
                theme.category === selectedCategory) &&
              (selectedSeason === "all" || theme.season === selectedSeason)
          )
          .map((theme, index) => (
            <div key={index} className="theme-card">
              <div className="theme-image">
                {/* 이미지 추가 예정 */}
                <div className="theme-overlay">
                  <span className="season-tag">{theme.season}</span>
                  <span className="category-tag">{theme.category}</span>
                </div>
              </div>
              <div className="theme-content">
                <h3>{theme.title}</h3>
                <p>{theme.description}</p>
                <button className="view-details">자세히 보기</button>
              </div>
            </div>
          ))}
      </div>

      <div className="recommendation-section">
        <h2>맞춤 추천</h2>
        <div className="recommendation-cards">
          {/* 사용자 취향 기반 추천 카드들 */}
        </div>
      </div>
    </div>
  );
};

export default Categories;
