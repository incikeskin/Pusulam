import { createSlice } from "@reduxjs/toolkit";
import type { QuestionItem } from "@/redux/types";
import {
    fetchQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion
} from "./adminQuestionThunks";

interface AdminQuestionsState {
    questions: QuestionItem[];
    loading: boolean;
    error: string | null;
}

const initialState: AdminQuestionsState = {
    questions: [],
    loading: false,
    error: null
};

const adminQuestionsSlice = createSlice({
    name: "adminQuestions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuestions.fulfilled, (state, action) => {
                state.questions = action.payload;
                state.loading = false;
            })
            .addCase(addQuestion.fulfilled, (state, action) => {
                state.questions.unshift(action.payload);
            })
            .addCase(deleteQuestion.fulfilled, (state, action) => {
                state.questions = state.questions.filter(
                    (q) => q._id !== action.payload
                );
            })
            .addCase(updateQuestion.fulfilled, (state, action) => {
                const index = state.questions.findIndex(
                    (q) => q._id === action.payload._id
                );
                if (index !== -1) {
                    state.questions[index] = {
                        ...state.questions[index],
                        ...action.payload
                    };
                }
            });
    }
});

export default adminQuestionsSlice.reducer;
