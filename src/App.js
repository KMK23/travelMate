import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import NaverCallback from "./components/auth/NaverCallback";
import "./styles/App.scss";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/landing" />;
};

const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return !isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Header />}
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/landing"
            element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            }
          />
          <Route path="/auth/naver/callback" element={<NaverCallback />} />
          {/* 다른 소셜 로그인 콜백 라우트 */}
          <Route
            path="/auth/kakao/callback"
            element={<div>카카오 로그인 처리 중...</div>}
          />
          <Route
            path="/auth/google/callback"
            element={<div>구글 로그인 처리 중...</div>}
          />
        </Routes>
        {isAuthenticated && <Footer />}
      </div>
    </Router>
  );
}

export default App;
