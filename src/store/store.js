import { configureStore } from "@reduxjs/toolkit";
import locationBasedReducer from "./slices/locationBasedSlice";
import attractionsReducer from "./slices/attractionsSlice";
import festivalsReducer from "./slices/festivalsSlice";
import authReducer from "./slices/authSlice";
import wishlistReducer from "./slices/wishlistSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    locationBased: locationBasedReducer,
    attractions: attractionsReducer,
    festivals: festivalsReducer,
    wishlist: wishlistReducer,
  },
});

export default store;
