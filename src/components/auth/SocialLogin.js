import React from "react";
import "./SocialLogin.css";

const SocialLogin = () => {
  const handleKakaoLogin = () => {
    const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID;
    const KAKAO_REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  const handleNaverLogin = () => {
    const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
    const NAVER_REDIRECT_URI = process.env.REACT_APP_NAVER_REDIRECT_URI;
    const STATE = "random_state";
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}&state=${STATE}`;
    window.location.href = naverAuthUrl;
  };

  const handleGoogleLogin = () => {
    const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const GOOGLE_REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile`;
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="social-login-buttons">
      <button className="social-login-button kakao" onClick={handleKakaoLogin}>
        <span className="social-icon">K</span>
        카카오로 시작하기
      </button>
      <button className="social-login-button naver" onClick={handleNaverLogin}>
        <span className="social-icon">N</span>
        네이버로 시작하기
      </button>
      <button
        className="social-login-button google"
        onClick={handleGoogleLogin}
      >
        <span className="social-icon">G</span>
        구글로 시작하기
      </button>
    </div>
  );
};

export default SocialLogin;
