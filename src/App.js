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
import "./styles/App.scss";
import SocialLogin from "./components/auth/SocialLogin";
import NaverCallback from "./components/auth/NaverCallback";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/landing" />;
};

const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return !isAuthenticated ? children : <Navigate to="/" />;
};

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/auth/naver/callback" element={<NaverCallback />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
