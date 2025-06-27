import { configureStore } from "@reduxjs/toolkit";
import { notesApi } from "./services/notesApi";
import { authApi } from "./services/authApi";
import authReducer from "./features/authSlice";
import uiReducer from "./features/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    [authApi.reducerPath]: authApi.reducer,
    [notesApi.reducerPath]: notesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, notesApi.middleware),
});
