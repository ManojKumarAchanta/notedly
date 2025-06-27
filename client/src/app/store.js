import { configureStore } from "@reduxjs/toolkit";
import { notesApi } from "./services/notesApi";
import { authApi } from "./services/authApi";
import authReducer from "./features/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [notesApi.reducerPath]: notesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, notesApi.middleware),
});
