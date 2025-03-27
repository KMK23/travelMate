import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocationBased } from "../store/slices/locationBasedSlice";
import {
  addFavorite,
  removeFavorite,
  selectFavoriteItems,
} from "../store/slices/favoritesSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import noImage from "../images/noimage.png";
import "./NearbyAttractions.scss";
import { useNavigate } from "react-router-dom";
import {
  addFavoriteToFirestore,
  removeFavoriteFromFirestore,
  getFavoritesFromFirestore,
} from "../firebase";
import SearchBar from "./common/SearchBar";

const contentTypeMap = {
  12: "관광지",
  14: "문화시설",
  15: "축제공연행사",
  25: "여행코스",
  28: "레포츠",
  32: "숙박",
  38: "쇼핑",
  39: "음식점",
};

const NearbyAttractions = () => {
  const [selectedTab, setSelectedTab] = useState("12");
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    items: locationBasedList,
    status,
    error,
  } = useSelector((state) => state.locationBased);
  const favorites = useSelector(selectFavoriteItems);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const authState = JSON.parse(localStorage.getItem("authState") || "{}");
  const userId = authState.user?.uid;

  const isFirstRender = useRef(true);
  const prevTabRef = useRef(selectedTab);

  useEffect(() => {
    dispatch(fetchLocationBased({ contentTypeId: selectedTab }));
  }, [dispatch, selectedTab]);

  // 로그인한 사용자의 찜 목록 불러오기
  useEffect(() => {
    if (userId) {
      loadFavoritesFromFirestore();
    }
  }, [userId]);

  const loadFavoritesFromFirestore = async () => {
    try {
      const firestoreFavorites = await getFavoritesFromFirestore(userId);
      dispatch(addFavorite(firestoreFavorites));
    } catch (error) {
      console.error("즐겨찾기 로드 중 오류:", error);
    }
  };

  const handleTabChange = useCallback((tabId) => {
    console.log("Tab clicked:", tabId);
    setSelectedTab(String(tabId));
  }, []);

  const handleFavoriteClick = async (item) => {
    if (!isAuthenticated) {
      alert("즐겨찾기 기능을 사용하려면 로그인이 필요합니다.");
      return;
    }

    try {
      const isFavorite = favorites.some(
        (fav) => fav.contentId === item.contentId
      );

      if (isFavorite) {
        // 즐겨찾기 제거
        await removeFavoriteFromFirestore(userId, item.contentId);
        dispatch(removeFavorite(item.contentId));
      } else {
        // 즐겨찾기 추가
        const favoriteData = {
          contentId: item.contentId,
          title: item.title,
          firstimage: item.firstimage || noImage,
          addr1: item.addr1,
          tel: item.tel,
          contentTypeId: selectedTab,
        };

        await addFavoriteToFirestore(userId, favoriteData);
        dispatch(addFavorite(favoriteData));
      }
    } catch (error) {
      console.error("즐겨찾기 처리 중 오류:", error);
    }
  };

  // 검색어 변경 핸들러 추가
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // 검색어로 필터링된 목록을 반환하는 함수
  const getFilteredList = useCallback(() => {
    if (!searchTerm.trim()) return locationBasedList;

    return locationBasedList.filter((item) => {
      const title = (item.title || "").toLowerCase();
      const addr = (item.addr1 || "").toLowerCase();
      const search = searchTerm.toLowerCase().trim();

      return title.includes(search) || addr.includes(search);
    });
  }, [locationBasedList, searchTerm]);

  // 검색어가 변경될 때마다 콘솔에 로그 출력 (디버깅용)
  useEffect(() => {
    console.log("Current search term:", searchTerm);
    console.log("Filtered results:", getFilteredList());
  }, [searchTerm, getFilteredList]);

  if (status === "loading") return <div className="loading">로딩 중...</div>;
  if (status === "failed") return <div className="error">{error}</div>;

  const filteredList = getFilteredList();

  return (
    <div className="nearby-attractions">
      <div className="section-header">
        <h2 className="section-title">제주도 인기 관광지</h2>
        <div className="search-wrapper">
          <SearchBar
            value={searchTerm}
            onChange={handleSearch}
            placeholder="관광지 이름으로 검색하세요"
          />
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          {Object.entries(contentTypeMap).map(([id, name]) => (
            <button
              key={id}
              className={`tab ${selectedTab === id ? "active" : ""}`}
              onClick={() => handleTabChange(id)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="attractions-grid">
        {filteredList.length > 0 ? (
          filteredList.map((item) => {
            const isFavorite = favorites.some(
              (fav) => fav.contentId === item.contentId
            );

            return (
              <div key={item.contentId} className="attraction-card">
                <div className="attraction-image">
                  <img
                    src={item.firstimage || noImage}
                    alt={item.title}
                    className={!item.firstimage ? "no-image" : ""}
                    onClick={() => navigate(`/detail/${item.contentId}`)}
                  />
                  <button
                    className={`favorite-button ${
                      isFavorite ? "favorited" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavoriteClick(item);
                    }}
                  >
                    {isFavorite ? (
                      <FaHeart className="heart-icon filled" />
                    ) : (
                      <FaRegHeart className="heart-icon" />
                    )}
                  </button>
                </div>
                <div className="attraction-info">
                  <h3>{item.title}</h3>
                  <p className="address">{item.addr1}</p>
                  {item.tel && <p className="tel">{item.tel}</p>}
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-results">
            {searchTerm
              ? `"${searchTerm}"에 대한 검색 결과가 없습니다.`
              : "해당 카테고리에 관광지가 없습니다."}
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyAttractions;
