import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchLocationBased } from "../../api/tourApi";

// 비동기 액션 생성
export const fetchLocationBased = createAsyncThunk(
  "locationBased/fetchLocationBased",
  async ({ contentTypeId }) => {
    const response = await searchLocationBased({
      numOfRows: 30,
      pageNo: 1,
      contentTypeId,
      areaCode: "39", // 제주도 지역 코드
    });
    return response;
  }
);

const locationBasedSlice = createSlice({
  name: "locationBased",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocationBased.pending, (state) => {
        state.status = "loading";
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
