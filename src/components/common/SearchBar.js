import React, { useState } from "react";
import "../../styles/components/SearchBar.scss";

const SearchBar = ({ onSearch, placeholder = "검색어를 입력하세요" }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      <button type="submit" className="search-button">
        검색
      </button>
    </form>
  );
};

export default SearchBar;
