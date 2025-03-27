import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFestivals } from "../store/slices/festivalsSlice";
import Card from "../components/common/Card";
import SearchBar from "../components/common/SearchBar";
import Filter from "../components/common/Filter";
import "../styles/pages/Festivals.scss";

const Festivals = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.festivals);
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchFestivals({ numOfRows: 20 }));
  }, [dispatch]);

  const handleSearch = (searchTerm) => {
    dispatch(fetchFestivals({ keyword: searchTerm }));
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    // 여기에 필터링 로직 추가
  };

  const filters = [
    { label: "전체", value: "all" },
    { label: "문화축제", value: "cultural" },
    { label: "음식축제", value: "food" },
    { label: "자연축제", value: "nature" },
    { label: "전통축제", value: "traditional" },
  ];

  return (
    <div className="festivals-page">
      <div className="page-header">
        <h1>축제 목록</h1>
        <SearchBar onSearch={handleSearch} placeholder="축제를 검색해보세요" />
      </div>

      <Filter
        filters={filters}
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
      />

      <div className="festivals-grid">
        {status === "succeeded" &&
          items.map((festival) => (
            <Card
              key={festival.contentid}
              item={festival}
              type="festival"
              onFavorite={() => {}}
            />
          ))}
      </div>
    </div>
  );
};

export default Festivals;
