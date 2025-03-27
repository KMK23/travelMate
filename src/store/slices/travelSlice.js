import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addDatas, getDatas, updateDatas, deleteDatas } from "../../firebase";
import { toast } from "react-toastify";

const initialState = {
  plans: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchPlans = createAsyncThunk(
  "travel/fetchPlans",
  async (userId, { rejectWithValue }) => {
    try {
      console.log("Fetching plans for userId:", userId);
      const plans = await getDatas("plan", userId);
      console.log("Fetched plans:", plans);
      return plans || [];
    } catch (error) {
      console.error("Error fetching plans:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const addNewPlan = createAsyncThunk(
  "travel/addNewPlan",
  async ({ userId, planData }, { rejectWithValue, dispatch }) => {
    try {
      console.log("Adding new plan for userId:", userId, "data:", planData);
      const newPlan = await addDatas(
        "plan",
        {
          ...planData,
          createdAt: new Date().toISOString(),
        },
        userId
      );
      console.log("Added new plan:", newPlan);
      toast.success("새로운 여행 계획이 추가되었습니다!");
      // 새로운 계획이 추가된 후 목록을 다시 불러옵니다
      dispatch(fetchPlans(userId));
      return newPlan;
    } catch (error) {
      console.error("Error adding plan:", error);
      toast.error("여행 계획 추가에 실패했습니다.");
      return rejectWithValue(error.message);
    }
  }
);

export const updateExistingPlan = createAsyncThunk(
  "travel/updateExistingPlan",
  async ({ userId, planId, planData }, { rejectWithValue, dispatch }) => {
    try {
      console.log(
        "Updating plan:",
        planId,
        "for userId:",
        userId,
        "data:",
        planData
      );
      await updateDatas(
        "plan",
        planId,
        {
          ...planData,
          updatedAt: new Date().toISOString(),
        },
        userId
      );
      console.log("Updated plan:", planId);
      toast.success("여행 계획이 수정되었습니다!");
      // 수정된 후 목록을 다시 불러옵니다
      dispatch(fetchPlans(userId));
      return { id: planId, ...planData };
    } catch (error) {
      console.error("Error updating plan:", error);
      toast.error("여행 계획 수정에 실패했습니다.");
      return rejectWithValue(error.message);
    }
  }
);

export const deleteExistingPlan = createAsyncThunk(
  "travel/deleteExistingPlan",
  async ({ userId, planId }, { rejectWithValue, dispatch }) => {
    try {
      console.log("Deleting plan:", planId, "for userId:", userId);
      await deleteDatas("plan", planId, userId);
      console.log("Deleted plan:", planId);
      toast.success("여행 계획이 삭제되었습니다!");
      // 삭제된 후 목록을 다시 불러옵니다
      dispatch(fetchPlans(userId));
      return planId;
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("여행 계획 삭제에 실패했습니다.");
      return rejectWithValue(error.message);
    }
  }
);

const travelSlice = createSlice({
  name: "travel",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Plans
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
        state.error = null;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Plan
      .addCase(addNewPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewPlan.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addNewPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Plan
      .addCase(updateExistingPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingPlan.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateExistingPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Plan
      .addCase(deleteExistingPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExistingPlan.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteExistingPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default travelSlice.reducer;
