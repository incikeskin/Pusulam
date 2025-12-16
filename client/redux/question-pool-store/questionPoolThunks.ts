// redux/question-pool-store/questionPoolThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { AxiosError, isAxiosError } from "axios";

/* -------------------- TYPES -------------------- */

export interface FetchQuestionsArgs {
  categoryId: string;
  difficulty?: "easy" | "medium" | "hard";
}

/* -------------------- THUNKS -------------------- */

// 🔹 Kategorileri getir
export const fetchCategories = createAsyncThunk<
  any[],
  void,
  { rejectValue: string }
>("questionPool/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("/api/categories");
    return res.data.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message || "Kategoriler alınamadı");
    }
    return rejectWithValue("Bilinmeyen hata");
  }
});

// 🔹 Kategori + zorluk seviyesine göre soruları getir
export const fetchQuestionsByCategory = createAsyncThunk<
  any[],
  FetchQuestionsArgs,
  { rejectValue: string }
>(
  "questionPool/fetchQuestionsByCategory",
  async ({ categoryId, difficulty }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/api/questions/list-by-category/${categoryId}`,
        {
          params: difficulty ? { difficulty } : {},
        }
      );

      return res.data.data;
    } catch (err) {
      if (isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.message || "Sorular alınamadı"
        );
      }
      return rejectWithValue("Bilinmeyen hata");
    }
  }
);
