// redux/student-store/studentSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { getStudentClasses } from "./studentThunks";
import type { Class } from "./types";

interface StudentState {
    classes: Class[];
    loadingClasses: boolean;
    classesError?: string;
}

const initialState: StudentState = {
    classes: [],
    loadingClasses: false,
    classesError: undefined,
};

const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getStudentClasses.pending, (state) => {
                state.loadingClasses = true;
                state.classesError = undefined;
            })
            .addCase(getStudentClasses.fulfilled, (state, action) => {
                state.loadingClasses = false;
                state.classes = action.payload;
            })
            .addCase(getStudentClasses.rejected, (state, action) => {
                state.loadingClasses = false;
                state.classesError = action.payload;
            });
    },
});

export default studentSlice.reducer;