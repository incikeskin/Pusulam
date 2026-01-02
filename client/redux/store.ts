import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-store/authSlice";
import teacherReducer from "./teacher-store/teacherSlice";
import classDetailReducer from "./classDetail-store/classDetailSlice";
import assignmentCreateReducer from "./assignment-create-store/assignmentCreateSlice";
import questionPoolReducer from "./question-pool-store/questionPoolSlice";
import assignmentDetailReducer from "./assignment-detail-store/assignmentDetailSlice";
import assignmentResultReducer from "./assignment-result-store/assignmentResultSlice";
import createClassReducer from "./create-class-store/createClassSlice";
import studentSearchReducer from "./studentSearch-store/studentSearchSlice";
import studentClassCreateReducer from "./studentClassCreate-store/studentClassCreateSlice";
import studentReducer from "./student-store/studentSlice";
import adminDashboardReducer  from "./admin-store/adminDashboardSlice";
import adminUsersReducer from "./admin-store/adminUsersSlice";
import adminClassesReducer from "./admin-classes-store/adminClassesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    teacher: teacherReducer,
    classDetail: classDetailReducer,
    assignmentCreate: assignmentCreateReducer,
    questionPool: questionPoolReducer,
    assignmentDetail: assignmentDetailReducer,
    assignmentResult: assignmentResultReducer,
    createClass: createClassReducer,
    studentSearch: studentSearchReducer,
    studentClassCreate: studentClassCreateReducer,
    student: studentReducer,
    adminDashboard: adminDashboardReducer,
    adminUsers: adminUsersReducer,
    adminClasses: adminClassesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
