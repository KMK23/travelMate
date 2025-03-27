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
import NaverCallback from "./components/auth/NaverCallback";
import Favorites from "./pages/Favorites";
import LocationBased from "./pages/LocationBased";
import Categories from "./pages/Categories";

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
      <div className="App">
        <Header />
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
            path="/favorites"
            element={
              <PrivateRoute>
                <>
                  <Favorites />
                </>
              </PrivateRoute>
            }
          />
          <Route path="/landing" element={<Landing />} />
          <Route path="/auth/naver/callback" element={<NaverCallback />} />
          <Route
            path="/location-based"
            element={
              <PrivateRoute>
                <LocationBased />
              </PrivateRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <PrivateRoute>
                <Categories />
              </PrivateRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
