import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../store/slices/authSlice";

const NaverCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleNaverCallback = async () => {
      const code = new URL(window.location.href).searchParams.get("code");
      const state = new URL(window.location.href).searchParams.get("state");

      if (code && state) {
        try {
          // 서버에 인증 코드 전송
          const response = await fetch("/api/auth/naver/callback", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code, state }),
          });

          if (response.ok) {
            const data = await response.json();
            // 로그인 성공 처리
            dispatch(loginSuccess(data.user));
            navigate("/");
          } else {
            console.error("네이버 로그인 실패");
            navigate("/landing");
          }
        } catch (error) {
          console.error("네이버 로그인 처리 중 오류 발생:", error);
          navigate("/landing");
        }
      }
    };

    handleNaverCallback();
  }, [dispatch, navigate]);

  return (
    <div className="oauth-callback-container">
      <div className="loading-spinner"></div>
      <p>네이버 로그인 처리 중...</p>
    </div>
  );
};

export default NaverCallback;
