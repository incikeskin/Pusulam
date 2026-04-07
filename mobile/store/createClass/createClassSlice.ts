import { createSlice } from "@reduxjs/toolkit";
import type { CreateClassState } from "./createClassTypes";
import { createClass } from "./createClassThunks";

const initialState: CreateClassState = {
    loading: false,
    error: null,
    success: false,
    createdClass: null,
};

const classCreateSlice = createSlice({
    name: "classCreate",
    initialState,
    reducers: {
        resetClassCreate(state) {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.createdClass = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createClass.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createClass.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.createdClass = action.payload; // 👈 önemli fark
            })
            .addCase(createClass.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Sınıf oluşturulamadı";
            });
    },
});

export const { resetClassCreate } = classCreateSlice.actions;
export default classCreateSlice.reducer;