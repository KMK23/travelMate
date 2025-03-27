import { configureStore } from "@reduxjs/toolkit";
import attractionsReducer from "./slices/attractionsSlice";
import festivalsReducer from "./slices/festivalsSlice";
import favoritesReducer from "./slices/favoritesSlice";
import authReducer from "./slices/authSlice";
import locationBasedReducer from "./slices/locationBasedSlice";
import searchReducer from "./slices/searchSlice";

export const store = configureStore({
  reducer: {
    attractions: attractionsReducer,
    festivals: festivalsReducer,
    favorites: favoritesReducer,
    auth: authReducer,
    locationBased: locationBasedReducer,
    search: searchReducer,
  },
});
