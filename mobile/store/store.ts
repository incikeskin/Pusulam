import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import studentReducer from "./student/studentSlice";
import classDetailReducer from "./classDetail/classDetailSlice";
import assignmentResultReducer from "./assignmentResult/assignmentResultSlice";
import assignmentDetailReducer from "./assignmentDetail/assignmentDetailSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        student: studentReducer,
        classDetail: classDetailReducer,
        assignmentResult: assignmentResultReducer,
        assignmentDetail: assignmentDetailReducer,
    },
});

// types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;