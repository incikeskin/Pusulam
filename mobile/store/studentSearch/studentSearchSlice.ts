
import { createSlice } from "@reduxjs/toolkit";
import type { StudentSearchState } from "./studentSearchTypes";
import { findStudent } from "./studentSearchThunks";

const initialState: StudentSearchState = {
    loading: false,
    error: null,
    student: null,
};

const studentSearchSlice = createSlice({
    name: "studentSearch",
    initialState,
    reducers: {
        clearStudentSearch(state) {
            state.loading = false;
            state.error = null;
            state.student = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(findStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.student = null;
            })
            .addCase(findStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.student = action.payload;
            })
            .addCase(findStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Öğrenci bulunamadı";
            });
    },
});

export const { clearStudentSearch } = studentSearchSlice.actions;
export default studentSearchSlice.reducer;