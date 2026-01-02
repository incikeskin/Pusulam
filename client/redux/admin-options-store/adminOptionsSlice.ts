import { createSlice } from "@reduxjs/toolkit";
import {
    fetchOptionsByQuestion,
    updateOption,
    deleteOption,
    createOption,
} from "./adminOptionsThunks";

interface OptionItem {
    _id: string;
    text: string;
    is_correct: boolean;
}

interface State {
    options: OptionItem[];
    loading: boolean;
}

const initialState: State = {
    options: [],
    loading: false
};

const adminOptionSlice = createSlice({
    name: "adminOptions",
    initialState,
    reducers: {
        clearOptions: (state) => {
            state.options = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOptionsByQuestion.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOptionsByQuestion.fulfilled, (state, action) => {
                state.options = action.payload;
                state.loading = false;
            })
            .addCase(updateOption.fulfilled, (state, action) => {
                const index = state.options.findIndex(
                    (o) => o._id === action.payload._id
                );
                if (index !== -1) {
                    state.options[index] = action.payload;
                }
            })
            .addCase(createOption.fulfilled, (state, action) => {
                state.options.push(action.payload);
            })

            .addCase(deleteOption.fulfilled, (state, action) => {
                state.options = state.options.filter(
                    (o) => o._id !== action.payload
                );
            });
    }
});

export const { clearOptions } = adminOptionSlice.actions;
export default adminOptionSlice.reducer;
