import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null, // Parse user info from localStorage
  // Check if token exists to determine authentication status
  isAuthenticated: !!localStorage.getItem("token"), // Convert to boolean
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true; // Set to true when credentials are set
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user)); // Store user info in localStorage
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false; // Set to false when logging out
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const isAuthenticated = (state) => state.auth.isAuthenticated;
