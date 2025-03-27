import React, { useState } from "react";
import { useSelector } from "react-redux";
import heroBg from "../images/hero-bg.jpg";
import hanraMountain from "../images/hanraMountain.jpg";
import jejuBeach from "../images/jejuBeach.jpg";
import jeju from "../images/jeju.jpg";
import gogiNoodle from "../images/gogiNoodle.webp";
import "../styles/pages/Home.scss";
import NearbyAttractions from "../components/NearbyAttractions";
import TravelPlanList from "../components/TravelPlanList";
import TravelPlanForm from "../components/TravelPlanForm";

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const [editingPlan, setEditingPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (searchTerm) => {
    // TODO: 검색 기능 구현
    console.log("Searching for:", searchTerm);
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
  };

  const handleEditComplete = () => {
    setEditingPlan(null);
  };

  const highlights = [
    {
      id: 1,
      icon: "fas fa-mountain",
      title: "한라산",
      description: "제주의 상징, 한라산 등반",
      details:
        "해발 1,947m의 한라산은 제주도의 중심에 위치한 휴화산으로, 계절마다 다른 매력을 선사합니다. 성판악, 관음사, 영실, 어리목 등 다양한 등산로가 있어 당신의 체력과 시간에 맞는 코스를 선택할 수 있습니다.",
      image: hanraMountain,
    },
    {
      id: 2,
      icon: "fas fa-water",
      title: "해변",
      description: "아름다운 해변과 서핑",
      details:
        "협재해수욕장, 함덕해수욕장, 이호테우해변 등 에메랄드빛 바다와 하얀 모래사장이 매력적인 해변들이 있습니다. 여름철 수영과 서핑은 물론, 사계절 내내 아름다운 풍경을 감상할 수 있습니다.",
      image: jejuBeach,
    },
    {
      id: 3,
      icon: "fas fa-hiking",
      title: "올레길",
      description: "제주 올레길 트레킹",
      details:
        "제주 올레길은 제주의 아름다운 해안과 오름, 마을을 걸어서 둘러볼 수 있는 도보여행 코스입니다. 총 26개 코스가 있어 취향에 따라 선택할 수 있으며, 각각의 코스는 독특한 제주의 풍경을 선사합니다.",
      image: jeju,
    },
    {
      id: 4,
      icon: "fas fa-utensils",
      title: "향토음식",
      description: "제주 전통 맛집 탐방",
      details:
        "흑돼지, 해산물, 전통 음식 등 제주도만의 특별한 맛을 경험해보세요. 신선한 해산물로 만든 회와 물회, 제주 흑돼지 구이, 오메기떡 등 제주도만의 독특한 음식 문화를 즐길 수 있습니다.",
      image: gogiNoodle,
    },
  ].slice(0, 4); // 4개의 항목만 표시

  return (
    <div className="home">
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBg})`,
        }}
      >
        <h1>제주도의 모든 것</h1>
        <p>섬 속의 천국, 제주도에서 특별한 추억을 만들어보세요</p>
        {/* <SearchBar
          onSearch={handleSearch}
          placeholder="제주도의 관광지를 검색해보세요"
        /> */}
      </section>

      <section className="main-content">
        <div className="weather-section">
          <TravelPlanForm
            editingPlan={editingPlan}
            onEditComplete={handleEditComplete}
          />
        </div>

        <div className="planner-section">
          <TravelPlanList onEdit={handleEdit} />
        </div>
      </section>

      <section className="jeju-highlights">
        <h2>제주도 여행 하이라이트</h2>
        <div className="highlights-grid">
          {highlights.map((item) => (
            <div key={item.id} className="highlight-card">
              <div className="highlight-image">
                <img src={item.image} alt={item.title} />
                <div className="highlight-overlay">
                  <div className="highlight-icon">
                    <i className={item.icon}></i>
                  </div>
                </div>
              </div>
              <div className="highlight-content">
                <h3>{item.title}</h3>
                <p className="highlight-description">{item.description}</p>
                <p className="highlight-details">{item.details}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <NearbyAttractions />
    </div>
  );
};

export default Home;
