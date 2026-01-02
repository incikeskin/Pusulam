import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

/* 📋 Soruları getir */
export const fetchQuestions = createAsyncThunk(
    "adminQuestions/fetchQuestions",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/api/questions");
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

/* ➕ Soru ekle */
export const addQuestion = createAsyncThunk(
    "adminQuestions/addQuestion",
    async (payload: any, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/api/questions/add", payload);
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

/* ✏️ Güncelle */
export const updateQuestion = createAsyncThunk(
    "adminQuestions/updateQuestion",
    async (payload: any, { rejectWithValue }) => {
        try {
            await axiosInstance.post("/api/questions/update", payload);
            return payload;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

/* ❌ Sil */
export const deleteQuestion = createAsyncThunk(
    "adminQuestions/deleteQuestion",
    async (_id: string, { rejectWithValue }) => {
        try {
            await axiosInstance.post("/api/questions/delete", { _id });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);
