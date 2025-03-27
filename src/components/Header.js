import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.scss";

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          TravelMate
        </Link>
        <nav className="nav-menu">
          <Link to="/" className="nav-item">
            홈
          </Link>
          <Link to="/attractions" className="nav-item">
            관광지
          </Link>
          <Link to="/festivals" className="nav-item">
            축제
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
