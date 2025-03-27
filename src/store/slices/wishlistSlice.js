import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDatas, deleteDatas, getDatas, updateDatas } from "../../firebase";

// 찜 목록 가져오기
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const resultData = await getDatas("wishlists", userId);
      return resultData?.items || [];
    } catch (error) {
      console.error("찜 목록 가져오기 실패:", error);
      return rejectWithValue(error.message);
    }
  }
);

// 관광지 찜하기
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ userId, item }, { rejectWithValue }) => {
    try {
      // wishlists 컬렉션의 사용자 문서에 items 배열로 저장
      const existingData = await getDatas("wishlists", userId);
      const items = existingData?.items || [];

      // 중복 체크
      if (!items.some((existing) => existing.contentid === item.contentid)) {
        items.push({
          ...item,
          addedAt: new Date().toISOString(),
        });

        await updateDatas("wishlists", userId, { items });
        return items;
      }
      return items;
    } catch (error) {
      console.error("찜하기 실패:", error);
      return rejectWithValue(error.message);
    }
  }
);

// 찜 제거하기
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async ({ userId, contentid }, { rejectWithValue }) => {
    try {
      const existingData = await getDatas("wishlists", userId);
      const items = existingData?.items || [];

      const updatedItems = items.filter((item) => item.contentid !== contentid);
      await updateDatas("wishlists", userId, { items: updatedItems });

      return updatedItems;
    } catch (error) {
      console.error("찜 제거 실패:", error);
      return rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 찜 목록 가져오기
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 찜하기
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 찜 제거
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default wishlistSlice.reducer;
