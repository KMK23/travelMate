import { configureStore } from "@reduxjs/toolkit";
import locationBasedReducer from "./slices/locationBasedSlice";
import authReducer from "./slices/authSlice";
import wishlistReducer from "./slices/wishlistSlice";
import travelReducer from "./slices/travelSlice";
import favoritesReducer from "./slices/favoritesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    locationBased: locationBasedReducer,
    wishlist: wishlistReducer,
    travel: travelReducer,
    favorites: favoritesReducer,
  },
});

export default store;
