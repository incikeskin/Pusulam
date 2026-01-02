import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

/* 📋 Sorunun şıklarını getir */
export const fetchOptionsByQuestion = createAsyncThunk(
    "adminOptions/fetchByQuestion",
    async (questionId: string, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(
                `/api/options/list-by-question/${questionId}`
            );
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

/* ✏️ Şık güncelle */
export const updateOption = createAsyncThunk(
    "adminOptions/update",
    async (payload: any, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/api/options/update", payload);
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

/* ➕ Şık ekle */
export const createOption = createAsyncThunk(
    "adminOptions/create",
    async (
        payload: {
            question: string;
            text: string;
            is_correct: boolean;
        },
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.post("/api/options/create", payload);
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

/* ❌ Şık sil */
export const deleteOption = createAsyncThunk(
    "adminOptions/delete",
    async (optionId: string, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/api/options/delete/${optionId}`);
            return optionId;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);
