import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import WeatherInfo from "../components/WeatherInfo";
import TravelPlanner from "../components/TravelPlanner";
import "../styles/Home.scss";

const Home = () => {
  return (
    <Container className="home-container">
      <h1 className="text-center mb-4">내 주변 관광지</h1>
      <Row>
        <Col md={6} className="mb-4">
          <WeatherInfo />
        </Col>
        <Col md={6} className="mb-4">
          <TravelPlanner />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
