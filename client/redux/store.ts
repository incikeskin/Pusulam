import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-store/authSlice";
import teacherReducer from "./teacher-store/teacherSlice";
import classDetailReducer from "./classDetail-store/classDetailSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    teacher: teacherReducer,
    classDetail: classDetailReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
