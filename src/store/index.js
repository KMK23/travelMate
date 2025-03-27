import { configureStore } from "@reduxjs/toolkit";
import attractionsReducer from "./slices/attractionsSlice";
import festivalsReducer from "./slices/festivalsSlice";

export const store = configureStore({
  reducer: {
    attractions: attractionsReducer,
    festivals: festivalsReducer,
  },
});
