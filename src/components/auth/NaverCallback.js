import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/authSlice";

const NaverCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
      callbackUrl: `${window.location.origin}/auth/naver/callback`,
    });

    naverLogin.init();

    naverLogin.getLoginStatus((status) => {
      if (status) {
        const user = {
          uid: `naver:${naverLogin.user.id}`,
          displayName: naverLogin.user.name,
          email: naverLogin.user.email,
          photoURL: naverLogin.user.profile_image,
          provider: "naver",
        };
        dispatch(loginSuccess(user));
        navigate("/");
      } else {
        console.error("네이버 로그인 실패");
        navigate("/landing");
      }
    });
  }, [dispatch, navigate]);

  return (
    <div className="loading">
      <p>네이버 로그인 처리중...</p>
    </div>
  );
};

export default NaverCallback;
