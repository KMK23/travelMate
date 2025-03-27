import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addData, getData, deleteData, updateData } from "../../firebase";

// Firebase에서 즐겨찾기 조회
export const fetchFavoritesFromFirebase = createAsyncThunk(
  "favorites/fetchFromFirebase",
  async () => {
    const response = await getData("favorites");
    return response;
  }
);

// Firebase에 즐겨찾기 추가
export const addFavoriteToFirebase = createAsyncThunk(
  "favorites/addToFirebase",
  async (favorite) => {
    const response = await addData("favorites", favorite);
    return response;
  }
);

// Firebase에서 즐겨찾기 삭제
export const deleteFavoriteFromFirebase = createAsyncThunk(
  "favorites/deleteFromFirebase",
  async (favoriteId) => {
    await deleteData("favorites", favoriteId);
    return favoriteId;
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearFavorites: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoritesFromFirebase.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFavoritesFromFirebase.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchFavoritesFromFirebase.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addFavoriteToFirebase.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteFavoriteFromFirebase.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
