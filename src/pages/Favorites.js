import React from "react";
import { useSelector } from "react-redux";

const Favorites = () => {
  const favorites = useSelector((state) => state.favorites.items);

  return (
    <div className="favorites-page">
      <div className="container">
        <h1>즐겨찾기</h1>
        {favorites.length === 0 ? (
          <p>즐겨찾기한 항목이 없습니다.</p>
        ) : (
          <div className="favorites-grid">
            {favorites.map((item) => (
              <div key={item.id} className="favorite-item">
                <h3>{item.title}</h3>
                <p>{item.addr1}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
