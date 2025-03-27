import React from "react";
import "../../styles/components/Filter.scss";

const Filter = ({ filters, selectedFilter, onFilterChange }) => {
  return (
    <div className="filter-container">
      {filters.map((filter) => (
        <button
          key={filter.value}
          className={`filter-button ${
            selectedFilter === filter.value ? "active" : ""
          }`}
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default Filter;
