import { createSlice } from "@reduxjs/toolkit";
import {
    fetchCategories,
    addCategory,
    deleteCategory,
    updateCategory,
} from "./adminCategoriesThunks";

interface Category {
    _id: string;
    name: string;
    is_active: boolean;
    questionCount: number;
}

interface State {
    categories: Category[];
    loading: boolean;
}

const initialState: State = {
    categories: [],
    loading: false,
};

const adminCategoriesSlice = createSlice({
    name: "adminCategories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
                state.loading = false;
            })
            .addCase(addCategory.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(
                    (c) => c._id !== action.payload
                );
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.categories.findIndex(
                    (c) => c._id === action.payload._id
                );
                if (index !== -1) {
                    state.categories[index].name = action.payload.name;
                }
            });
    },
});

export default adminCategoriesSlice.reducer;
