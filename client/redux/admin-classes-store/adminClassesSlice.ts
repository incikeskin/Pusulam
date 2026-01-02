import { createSlice } from "@reduxjs/toolkit";
import { fetchAllClasses, deleteClassById } from "./adminClassesThunks";
import { fetchAllStudentClasses } from "./adminClassesThunks";

interface AdminClassesState {
    loading: boolean;
    error: string | null;
    classes: any[];
    studentClasses: any[];
}

const initialState: AdminClassesState = {
    loading: false,
    error: null,
    classes: [],
    studentClasses: [],
};

const adminClassesSlice = createSlice({
    name: "adminClasses",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllClasses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllClasses.fulfilled, (state, action) => {
                state.loading = false;
                state.classes = action.payload;
            })
            .addCase(fetchAllClasses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Hata";
            })
            .addCase(deleteClassById.fulfilled, (state, action) => {
                state.classes = state.classes.filter(
                    (c) => c._id !== action.meta.arg
                );
            });
        builder.addCase(fetchAllStudentClasses.fulfilled, (state, action) => {
            state.studentClasses = action.payload;
        });
    },
});

export default adminClassesSlice.reducer;
