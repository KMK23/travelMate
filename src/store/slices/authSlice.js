import { createSlice } from "@reduxjs/toolkit";

// 로컬 스토리지에서 인증 상태 불러오기
const loadAuthState = () => {
  try {
    const authState = localStorage.getItem("authState");
    return authState ? JSON.parse(authState) : null;
  } catch (err) {
    console.error(
      "로컬 스토리지에서 인증 상태를 불러오는데 실패했습니다:",
      err
    );
    return null;
  }
};

// 초기 상태 설정
const savedState = loadAuthState();
const initialState = savedState || {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      // 로컬 스토리지에 인증 상태 저장
      localStorage.setItem(
        "authState",
        JSON.stringify({
          isAuthenticated: true,
          user: action.payload,
          loading: false,
          error: null,
        })
      );
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      localStorage.removeItem("authState");
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("authState");
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;

export default authSlice.reducer;
