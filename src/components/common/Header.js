import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import "./Header.scss";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/landing");
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <i className="fas fa-map-marked-alt"></i>
          트래블메이트
        </Link>

        <nav className="nav-links">
          <Link to="/" className="nav-link">
            <i className="fas fa-home"></i>홈
          </Link>
          <button className="nav-link logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            로그아웃
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
