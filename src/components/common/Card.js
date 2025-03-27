import React from "react";
import { Link } from "react-router-dom";
import "../../styles/components/Card.scss";

const Card = ({ item, type, onFavorite }) => {
  const { contentid, title, firstimage, addr1, eventstartdate, eventenddate } =
    item;

  return (
    <div className="card">
      <div className="card-image">
        <img
          src={firstimage || "/images/no-image.jpg"}
          alt={title}
          onError={(e) => {
            e.target.src = "/images/no-image.jpg";
          }}
        />
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-address">{addr1}</p>
        {type === "festival" && (
          <p className="card-date">
            {eventstartdate} ~ {eventenddate}
          </p>
        )}
        <div className="card-actions">
          <Link to={`/${type}/${contentid}`} className="btn-detail">
            자세히 보기
          </Link>
          <button className="btn-favorite" onClick={() => onFavorite(item)}>
            즐겨찾기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
