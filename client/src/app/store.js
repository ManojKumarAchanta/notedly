import { configureStore } from "@reduxjs/toolkit";
import { notesApi } from "./services/notesApi";
import { authApi } from "./services/authApi";
import authReducer from "./features/authSlice";
import uiReducer from "./features/uiSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { combineReducers } from "@reduxjs/toolkit";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["ui"], // only persist ui slice
};

const rootReducer = combineReducers({
  ui: uiReducer,
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [notesApi.reducerPath]: notesApi.reducer,
  // add other reducers here
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ],
      },
    })
      .concat(authApi.middleware) // Add authApi middleware
      .concat(notesApi.middleware), // Add notesApi middleware
});

export const persistor = persistStore(store);
