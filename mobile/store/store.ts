import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import studentReducer from "./student/studentSlice";
import classDetailReducer from "./classDetail/classDetailSlice";
import assignmentResultReducer from "./assignmentResult/assignmentResultSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        student: studentReducer,
        classDetail: classDetailReducer,
        assignmentResult: assignmentResultReducer,
    },
});

// types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;