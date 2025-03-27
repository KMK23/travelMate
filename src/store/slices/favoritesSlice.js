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
    loadFavoritesFromStorage: (state, action) => {
      const userId = action.payload;
      console.log("Loading favorites for userId:", userId);
      state.items = loadFavorites(userId);
      console.log("Loaded items into state:", state.items);
    },
    addFavorite: (state, action) => {
      const { item, userId } = action.payload;
      console.log("Adding favorite:", item);
      console.log("Current items:", state.items);

      // 중복 체크
      const isDuplicate = state.items.some(
        (existing) => existing.contentId === item.contentId
      );

      if (!isDuplicate) {
        state.items.push(item);
        console.log("Updated items after add:", state.items);
        saveFavorites(state.items, userId);
      } else {
        console.log("Item already exists in favorites");
      }
    },
    removeFavorite: (state, action) => {
      const { contentId, userId } = action.payload;
      console.log("Removing favorite with contentId:", contentId);
      state.items = state.items.filter((item) => item.contentId !== contentId);
      console.log("Updated items after remove:", state.items);
      saveFavorites(state.items, userId);
    },
    clearFavorites: (state, action) => {
      const userId = action.payload;
      state.items = [];
      saveFavorites(state.items, userId);
    },
  },
});

// Memoized Selectors
const selectFavoritesState = (state) => state.favorites;

export const selectFavoriteItems = createSelector(
  [selectFavoritesState],
  (favorites) => favorites?.items || []
);

export const {
  addFavorite,
  removeFavorite,
  clearFavorites,
  loadFavoritesFromStorage,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
