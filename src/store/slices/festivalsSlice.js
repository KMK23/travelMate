import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 더미 데이터
const dummyFestivals = [
  {
    contentid: "1",
    title: "제주 음식 문화제",
    addr1: "제주시",
    firstimage: "https://example.com/festival1.jpg",
    eventstartdate: "20240301",
    eventenddate: "20240331",
  },
  {
    contentid: "2",
    title: "제주 맛집 페스티벌",
    addr1: "제주시",
    firstimage: "https://example.com/festival2.jpg",
    eventstartdate: "20240401",
    eventenddate: "20240430",
  },
];

export const fetchFestivals = createAsyncThunk(
  "festivals/fetchFestivals",
  async () => {
    // API 호출 대신 더미 데이터 반환
    return dummyFestivals;
  }
);

const festivalsSlice = createSlice({
  name: "festivals",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFestivals.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFestivals.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchFestivals.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export default festivalsSlice.reducer;
