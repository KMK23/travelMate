import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import noImage from "../images/noimage.png";
import "./Favorites.scss";
import {
  addFavoriteToFirestore,
  removeFavoriteFromFirestore,
  getFavoritesFromFirestore,
} from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { removeFavorite } from "../store/slices/favoritesSlice";

const Favorites = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = JSON.parse(localStorage.getItem("authState") || "{}");
  const userId = authState.user?.uid;
  const favorites = useSelector((state) => state.favorites?.items || []);

  const loadFavorites = useCallback(async () => {
    if (!userId) {
      navigate("/");
      return;
    }
    try {
      setIsLoading(true);
      const firestoreFavorites = await getFavoritesFromFirestore(userId);
      dispatch({ type: "favorites/setFavorites", payload: firestoreFavorites });
      setIsLoading(false);
    } catch (error) {
      console.error("즐겨찾기 로드 중 오류:", error);
      setIsLoading(false);
    }
  }, [userId, navigate, dispatch]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      if (!userId) {
        console.log("사용자가 로그인하지 않았습니다.");
        return;
      }

      await removeFavoriteFromFirestore(userId, favoriteId);
      dispatch(removeFavorite(favoriteId));
      // 삭제 후 목록 다시 로드
      loadFavorites();
    } catch (error) {
      console.error("즐겨찾기 삭제 중 오류가 발생했습니다:", error);
    }
  };

  const handleItemClick = (contentId) => {
    navigate(`/detail/${contentId}`);
  };

  if (isLoading) {
    return (
      <div className="favorites-container">
        <h1>내 즐겨찾기</h1>
        <div className="loading-message">로딩 중...</div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="favorites-container">
        <h1>내 즐겨찾기</h1>
        <div className="no-favorites">
          <p>로그인이 필요한 서비스입니다.</p>
          <p>로그인 후 이용해주세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <h1>내 즐겨찾기</h1>
      <div className="favorites-grid">
        {favorites.length === 0 ? (
          <div className="no-favorites">
            <p>아직 찜한 관광지가 없습니다.</p>
          </div>
        ) : (
          favorites.map((favorite) => (
            <div key={favorite.contentId} className="favorite-item">
              <img
                src={favorite.firstimage || noImage}
                alt={favorite.title}
                className="favorite-image"
              />
              <div className="favorite-info">
                <h3>{favorite.title}</h3>
                <p>{favorite.addr1}</p>
                {favorite.tel && <p>{favorite.tel}</p>}
                <button
                  className="delete-button"
                  onClick={() => handleRemoveFavorite(favorite.contentId)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Favorites;
