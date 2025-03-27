import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import noImage from "../images/noimage.png";
import "./Favorites.scss";
import {
  getFavoritesFromFirestore,
  removeFavoriteFromFirestore,
  db,
} from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "@firebase/firestore";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const authState = JSON.parse(localStorage.getItem("authState"));
  const userId = authState?.user?.uid;

  useEffect(() => {
    loadFavorites();
  }, [userId]);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      if (!userId) {
        // 로그인하지 않은 경우 로컬스토리지에서 로드
        const storedFavorites = JSON.parse(
          localStorage.getItem(`favorites_${userId || "anonymous"}`) || "[]"
        );
        setFavorites(storedFavorites);
        setIsLoading(false);
        return;
      }

      const favoritesRef = collection(db, "users", userId, "favorites");
      const favoritesSnapshot = await getDocs(favoritesRef);
      const favoritesData = favoritesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavorites(favoritesData);
    } catch (error) {
      console.error("즐겨찾기를 불러오는 중 오류가 발생했습니다:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      if (!userId) {
        console.log("사용자가 로그인하지 않았습니다.");
        return;
      }

      const favoriteRef = doc(db, "users", userId, "favorites", favoriteId);
      await deleteDoc(favoriteRef);
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav.id !== favoriteId)
      );
      console.log("즐겨찾기가 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("즐겨찾기 삭제 중 오류가 발생했습니다:", error);
    }
  };

  const handleItemClick = (contentId) => {
    navigate(`/detail/${contentId}`);
  };

  if (isLoading) {
    return <div className="favorites-container">로딩 중...</div>;
  }

  if (!authState) {
    return (
      <div className="favorites-page">
        <h1 className="page-title">내가 찜한 목록</h1>
        <div className="no-favorites">
          <p>로그인이 필요한 서비스입니다.</p>
          <p>로그인 후 이용해주세요!</p>
        </div>
      </div>
    );
  }

  const favoritesToRender = Array.isArray(favorites) ? favorites : [];

  return (
    <div className="favorites-container">
      <h1>내 즐겨찾기</h1>
      {favoritesToRender.length === 0 ? (
        <div className="empty-message">즐겨찾기한 장소가 없습니다.</div>
      ) : (
        <div className="favorites-grid">
          {favoritesToRender.map((favorite) => (
            <div key={favorite.id} className="favorite-item">
              <div className="image-container">
                <img
                  src={favorite.firstimage || "/default-image.jpg"}
                  alt={favorite.title}
                />
                <button
                  className="remove-button"
                  onClick={() => handleRemoveFavorite(favorite.id)}
                >
                  삭제
                </button>
              </div>
              <div className="item-info">
                <h3>{favorite.title}</h3>
                <p>{favorite.addr1}</p>
                {favorite.tel && <p>{favorite.tel}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
