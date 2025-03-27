import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttractions } from "../store/slices/attractionsSlice";
import Card from "../components/common/Card";
import SearchBar from "../components/common/SearchBar";
import Filter from "../components/common/Filter";
import "../styles/pages/Attractions.scss";

const Attractions = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.attractions);
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchAttractions({ numOfRows: 20 }));
  }, [dispatch]);

  const handleSearch = (searchTerm) => {
    dispatch(fetchAttractions({ keyword: searchTerm }));
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    dispatch(
      fetchAttractions({
        contentTypeId: filter === "all" ? undefined : filter,
        numOfRows: 20,
      })
    );
  };

  const filters = [
    { label: "전체", value: "all" },
    { label: "관광지", value: "12" },
    { label: "문화시설", value: "14" },
    { label: "레포츠", value: "28" },
    { label: "숙박", value: "32" },
    { label: "쇼핑", value: "38" },
    { label: "음식점", value: "39" },
  ];

  const filteredItems =
    selectedFilter === "all"
      ? items
      : items.filter((item) => item.contenttypeid === selectedFilter);

  return (
    <div className="attractions-page">
      <div className="page-header">
        <h1>관광지 목록</h1>
        <SearchBar
          onSearch={handleSearch}
          placeholder="관광지를 검색해보세요"
        />
      </div>

      <Filter
        filters={filters}
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
      />

      <div className="attractions-grid">
        {status === "succeeded" &&
          filteredItems.map((attraction) => (
            <Card
              key={attraction.contentid}
              item={attraction}
              type="attraction"
              onFavorite={() => {}}
            />
          ))}
      </div>
    </div>
  );
};

export default Attractions;
