import React from "react";
import { useNavigate } from "react-router-dom";
import SocialLogin from "../components/auth/SocialLogin";
import heroBg from "../images/hero-bg.jpg";
import "../styles/pages/Landing.scss";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div
        className="hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroBg})`,
        }}
      >
        <div className="hero-content">
          <h1>제주도의 모든 것</h1>
          <p>
            제주도의 숨은 명소부터 인기 관광지까지
            <br />
            트래블메이트와 함께 특별한 여행을 시작하세요
          </p>

          <div className="login-section">
            <h2>시작하기</h2>
            <SocialLogin />
            <p className="terms">
              시작하기를 클릭하면 트래블메이트의
              <br />
              <a href="/terms">이용약관</a>과{" "}
              <a href="/privacy">개인정보 처리방침</a>에 동의하게 됩니다
            </p>
          </div>
        </div>
      </div>

      <section className="features">
        <div className="feature">
          <i className="fas fa-map-marked-alt"></i>
          <h3>현재 위치 기반 추천</h3>
          <p>
            내 주변의 숨은 명소를
            <br />
            쉽게 찾아보세요
          </p>
        </div>
        <div className="feature">
          <i className="fas fa-heart"></i>
          <h3>맞춤 여행 코스</h3>
          <p>
            취향에 맞는 제주도
            <br />
            여행 코스를 추천해드려요
          </p>
        </div>
        <div className="feature">
          <i className="fas fa-star"></i>
          <h3>실시간 리뷰</h3>
          <p>
            다른 여행자들의
            <br />
            생생한 후기를 확인하세요
          </p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
