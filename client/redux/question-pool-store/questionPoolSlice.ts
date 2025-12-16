// redux/question-pool-store/questionPoolSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchCategories,
  fetchQuestionsByCategory,
} from "./questionPoolThunks";

/* -------------------- TYPES -------------------- */

export interface QuestionPoolState {
  categories: any[];
  questions: any[];
  selectedCategoryId: string | null;
  selectedDifficulty: "easy" | "medium" | "hard" | "";
  loading: boolean;
  error: string | null;
}

/* -------------------- INITIAL STATE -------------------- */

const initialState: QuestionPoolState = {
  categories: [],
  questions: [],
  selectedCategoryId: null,
  selectedDifficulty: "",
  loading: false,
  error: null,
};

/* -------------------- SLICE -------------------- */

const questionPoolSlice = createSlice({
  name: "questionPool",
  initialState,
  reducers: {
    setSelectedCategory(state, action: PayloadAction<string | null>) {
      state.selectedCategoryId = action.payload;
      state.questions = []; // kategori değişince eski soruları temizle
    },

    setSelectedDifficulty(
      state,
      action: PayloadAction<"easy" | "medium" | "hard" | "">
    ) {
      state.selectedDifficulty = action.payload;
    },

    clearQuestionPool(state) {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    /* ---- Categories ---- */
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Kategori hatası";
      });

    /* ---- Questions ---- */
    builder
      .addCase(fetchQuestionsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestionsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Soru hatası";
      });
  },
});

export const {
  setSelectedCategory,
  setSelectedDifficulty,
  clearQuestionPool,
} = questionPoolSlice.actions;

export default questionPoolSlice.reducer;
