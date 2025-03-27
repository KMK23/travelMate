import React from "react";
import { useParams } from "react-router-dom";

const Detail = () => {
  const { id } = useParams();

  return (
    <div className="detail-page">
      <div className="container">
        <h1>상세 정보</h1>
        <p>관광지 ID: {id}</p>
      </div>
    </div>
  );
};

export default Detail;
