import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

/* 📌 Kategorileri getir */
export const fetchCategories = createAsyncThunk(
    "adminCategories/fetchCategories",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/api/categories");
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

/* ➕ Kategori ekle */
export const addCategory = createAsyncThunk(
    "adminCategories/addCategory",
    async ({ name }: { name: string }, { rejectWithValue }) => {
        try {
            await axiosInstance.post("/api/categories/add", { name });
            return true;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

/* ❌ Kategori sil */
export const deleteCategory = createAsyncThunk(
    "adminCategories/deleteCategory",
    async (_id: string, { rejectWithValue }) => {
        try {
            await axiosInstance.post("/api/categories/delete", { _id });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);
/* ✏️ Kategori güncelle */
export const updateCategory = createAsyncThunk(
    "adminCategories/updateCategory",
    async (
        { _id, name }: { _id: string; name: string },
        { rejectWithValue }
    ) => {
        try {
            await axiosInstance.post("/api/categories/update", {
                _id,
                name,
            });
            return { _id, name };
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);