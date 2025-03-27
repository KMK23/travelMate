import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";

// Load favorites from localStorage
const loadFavorites = (userId) => {
  try {
    const key = `favorites_${userId}`;
    console.log("Loading favorites with key:", key);
    const serializedFavorites = localStorage.getItem(key);
    console.log("Loaded favorites:", serializedFavorites);
    if (serializedFavorites === null) {
      return [];
    }
    return JSON.parse(serializedFavorites);
  } catch (err) {
    console.error("Error loading favorites from localStorage:", err);
    return [];
  }
};

// Save favorites to localStorage
const saveFavorites = (favorites, userId) => {
  try {
    const key = `favorites_${userId}`;
    console.log("Saving favorites with key:", key);
    console.log("Saving favorites data:", favorites);
    localStorage.setItem(key, JSON.stringify(favorites));
  } catch (err) {
    console.error("Error saving favorites to localStorage:", err);
  }
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
  },
  reducers: {
    setFavorites: (state, action) => {
      state.items = action.payload;
    },
    addFavorite: (state, action) => {
      // 단일 아이템 추가인 경우
      if (!Array.isArray(action.payload)) {
        const isDuplicate = state.items.some(
          (item) => item.contentId === action.payload.contentId
        );
        if (!isDuplicate) {
          state.items.push(action.payload);
        }
      } else {
        // 여러 아이템을 한번에 추가하는 경우 (초기 로드)
        state.items = action.payload;
      }
    },
    removeFavorite: (state, action) => {
      state.items = state.items.filter(
        (item) => item.contentId !== action.payload
      );
    },
    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

// Memoized Selectors
const selectFavoritesState = (state) => state.favorites;

export const selectFavoriteItems = createSelector(
  [selectFavoritesState],
  (favorites) => favorites?.items || []
);

export const { setFavorites, addFavorite, removeFavorite, clearFavorites } =
  favoritesSlice.actions;

export default favoritesSlice.reducer;
