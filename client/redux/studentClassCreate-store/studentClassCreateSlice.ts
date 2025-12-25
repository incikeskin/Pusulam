// redux/studentClassCreate-store/studentClassCreateSlice.ts

import { createSlice } from "@reduxjs/toolkit";
import type { StudentClassCreateState } from "./studentClassCreateTypes";
import { addStudentToClass, removeStudentFromClass } from "./studentClassCreateThunks";

const initialState: StudentClassCreateState = {
    loading: false,
    error: null,
    success: false,
};

const studentClassCreateSlice = createSlice({
    name: "studentClassCreate",
    initialState,
    reducers: {
        resetStudentClassCreate(state) {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addStudentToClass.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(addStudentToClass.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(addStudentToClass.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Öğrenci sınıfa eklenemedi";
            });
        // 🔹 Öğrenci çıkarma
        builder
            .addCase(removeStudentFromClass.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(removeStudentFromClass.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(removeStudentFromClass.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Öğrenci sınıftan çıkarılamadı";
            });
    },
});

export const { resetStudentClassCreate } =
    studentClassCreateSlice.actions;

export default studentClassCreateSlice.reducer;
