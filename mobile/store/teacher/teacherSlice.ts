// redux/teacher-store/teacherSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getTeacherClasses, ClassItem } from "./teacherThunks";

interface TeacherState {
    classes: ClassItem[];
    loading: boolean;
    error: string | null;
}

const initialState: TeacherState = {
    classes: [],
    loading: false,
    error: null,
};

const teacherSlice = createSlice({
    name: "teacher",
    initialState,
    reducers: {
        clearTeacherError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTeacherClasses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTeacherClasses.fulfilled, (state, action: PayloadAction<ClassItem[]>) => {
                state.loading = false;
                state.classes = action.payload;
            })
            .addCase(getTeacherClasses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Sınıflar yüklenemedi";
            });
    },
});

export const { clearTeacherError } = teacherSlice.actions;
export default teacherSlice.reducer;