import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { signOutUser } from "../../firebase";
import { FaHeart } from "react-icons/fa";
import "./Header.scss";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favorites = useSelector((state) => state.favorites?.items || []);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = async () => {
    try {
      await signOutUser();
      dispatch(logout());
      navigate("/landing");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <i className="fas fa-map-marked-alt"></i>
          travelmate
        </Link>

        <nav className="nav-links">
          <Link to="/" className="nav-link">
            <i className="fas fa-home"></i>홈
          </Link>
          {isAuthenticated && (
            <Link to="/favorites" className="nav-link favorites">
              <FaHeart className="heart-icon" />
              찜한 목록
              {favorites.length > 0 && (
                <span className="favorites-count">{favorites.length}</span>
              )}
            </Link>
          )}
          {isAuthenticated ? (
            <button className="nav-link logout" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              로그아웃
            </button>
          ) : (
            <Link to="/landing" className="nav-link">
              <i className="fas fa-sign-in-alt"></i>
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
