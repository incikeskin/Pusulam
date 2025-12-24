import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-store/authSlice";
import teacherReducer from "./teacher-store/teacherSlice";
import classDetailReducer from "./classDetail-store/classDetailSlice";
import assignmentCreateReducer from "./assignment-create-store/assignmentCreateSlice";
import questionPoolReducer from "./question-pool-store/questionPoolSlice";
import assignmentDetailReducer from "./assignment-detail-store/assignmentDetailSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    teacher: teacherReducer,
    classDetail: classDetailReducer,
    assignmentCreate: assignmentCreateReducer,
    questionPool: questionPoolReducer,
    assignmentDetail: assignmentDetailReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
