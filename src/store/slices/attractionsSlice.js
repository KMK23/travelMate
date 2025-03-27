import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 더미 데이터
const dummyAttractions = [
  {
    contentid: "1",
    title: "제주 맛집 거리",
    addr1: "제주시",
    firstimage: "https://example.com/attraction1.jpg",
    tel: "064-123-4567",
  },
  {
    contentid: "2",
    title: "제주 전통 시장",
    addr1: "제주시",
    firstimage: "https://example.com/attraction2.jpg",
    tel: "064-765-4321",
  },
];

export const fetchAttractions = createAsyncThunk(
  "attractions/fetchAttractions",
  async () => {
    // API 호출 대신 더미 데이터 반환
    return dummyAttractions;
  }
);

const attractionsSlice = createSlice({
  name: "attractions",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttractions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAttractions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAttractions.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export default attractionsSlice.reducer;
