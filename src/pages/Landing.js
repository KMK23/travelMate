import React from "react";
import SocialLogin from "../components/auth/SocialLogin";
import "../styles/pages/Landing.scss";

const Landing = () => {
  return (
    <div className="landing">
      <div className="content">
        <h1>제주도의 모든 것</h1>
        <p>
          제주도의 숨은 명소부터 인기 관광지까지
          <br />
          travelmate와 함께 특별한 여행을 시작하세요
        </p>

        <div className="login-container">
          <h2>소셜 로그인</h2>
          <SocialLogin />
          <p className="terms">
            시작하기를 클릭하면 travelmate의 <a href="/terms">이용약관</a>과{" "}
            <a href="/privacy">개인정보 처리방침</a>에 동의하게 됩니다
          </p>
        </div>
      </div>

      <div className="features">
        <div className="feature">
          <h3>현재 위치 기반 추천</h3>
          <p>내 주변의 숨은 명소를 쉽게 찾아보세요</p>
        </div>
        <div className="feature">
          <h3>맞춤 여행 코스</h3>
          <p>취향에 맞는 제주도 여행 코스를 추천해드려요</p>
        </div>
        <div className="feature">
          <h3>실시간 리뷰</h3>
          <p>다른 여행자들의 생생한 후기를 확인하세요</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
