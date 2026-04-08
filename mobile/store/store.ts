import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import studentReducer from "./student/studentSlice";
import classDetailReducer from "./classDetail/classDetailSlice";
import assignmentResultReducer from "./assignmentResult/assignmentResultSlice";
import assignmentDetailReducer from "./assignmentDetail/assignmentDetailSlice";
import createClassReducer from "./createClass/createClassSlice";
import teacherReducer from "./teacher/teacherSlice";
import studentClassCreateReducer from "./studentClassCreate/studentClassCreateSlice";
import studentSearchReducer from "./studentSearch/studentSearchSlice";
import assignmentCreateReducer from "./assignmentCreate/assignmentCreateSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        student: studentReducer,
        classDetail: classDetailReducer,
        assignmentResult: assignmentResultReducer,
        assignmentDetail: assignmentDetailReducer,
        createClass: createClassReducer,
        teacher: teacherReducer,
        studentClassCreate: studentClassCreateReducer,
        studentSearch: studentSearchReducer,
        assignmentCreate: assignmentCreateReducer,
    },
});

// types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;