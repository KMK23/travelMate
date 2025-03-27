import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { SiNaver, SiKakaotalk } from "react-icons/si";
import {
  signInWithNaver,
  signInWithKakao,
  getAuthResult,
  onAuthChange,
  signInWithGoogle,
  saveUserToFirestore,
} from "../../firebase";
import { loginSuccess } from "../../store/slices/authSlice";

const SocialLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState("초기화");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;

    const initializeAuth = async () => {
      try {
        setAuthStatus("인증 상태 확인 중");

        // 인증 상태 변경 감지 설정
        unsubscribe = onAuthChange((user) => {
          if (user) {
            console.log("사용자 로그인 감지:", user);
            setAuthStatus("로그인됨");
            dispatch(
              loginSuccess({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
              })
            );
            navigate("/");
          } else {
            console.log("로그인되지 않은 상태");
            setAuthStatus("로그인 필요");
          }
        });

        // 리다이렉트 결과 확인
        const user = await getAuthResult();
        if (user) {
          console.log("리다이렉트 후 사용자 정보:", user);
          setAuthStatus("인증 성공");
          dispatch(
            loginSuccess({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            })
          );
          navigate("/");
        }
      } catch (error) {
        console.error("인증 초기화 에러:", error);
        setError(error.message);
        setAuthStatus("인증 실패");
      }
    };

    initializeAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [dispatch, navigate]);

  const handleKakaoLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const user = await signInWithKakao();
      if (user) {
        await saveUserToFirestore(user);
        dispatch(loginSuccess(user));
        navigate("/");
      }
    } catch (error) {
      console.error("카카오 로그인 실패:", error);
      setError("카카오 로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNaverLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const user = await signInWithNaver();
      if (user) {
        await saveUserToFirestore(user);
        dispatch(loginSuccess(user));
        navigate("/");
      }
    } catch (error) {
      console.error("네이버 로그인 실패:", error);
      setError("네이버 로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const user = await signInWithGoogle();
      if (user) {
        await saveUserToFirestore(user);
        dispatch(loginSuccess(user));
        navigate("/");
      }
    } catch (error) {
      console.error("구글 로그인 실패:", error);
      setError("구글 로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="social-buttons">
      {error && <div className="error-message">{error}</div>}

      <button
        className={`social-button kakao ${isLoading ? "disabled" : ""}`}
        onClick={handleKakaoLogin}
        disabled={isLoading}
      >
        <SiKakaotalk size={18} />
        카카오로 시작하기
      </button>

      <button
        className={`social-button naver ${isLoading ? "disabled" : ""}`}
        onClick={handleNaverLogin}
        disabled={isLoading}
      >
        <SiNaver size={18} />
        네이버로 시작하기
      </button>

      <button
        className={`social-button google ${isLoading ? "disabled" : ""}`}
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <FcGoogle size={18} />
        구글로 시작하기
      </button>
    </div>
  );
};

export default SocialLogin;
