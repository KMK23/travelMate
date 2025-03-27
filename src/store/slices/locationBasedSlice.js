import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchLocationBased } from "../../api/tourApi";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

// 비동기 액션 생성
export const fetchLocationBased = createAsyncThunk(
  "locationBased/fetchLocationBased",
  async (params) => {
    const response = await searchLocationBased(params);
    return response;
  }
);

const locationBasedSlice = createSlice({
  name: "locationBased",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocationBased.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLocationBased.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchLocationBased.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default locationBasedSlice.reducer;
