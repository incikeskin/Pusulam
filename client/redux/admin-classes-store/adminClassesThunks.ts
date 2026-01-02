import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { isAxiosError } from "axios";

export const fetchAllClasses = createAsyncThunk<
    any[],
    void,
    { rejectValue: string }
>("adminClasses/fetchAllClasses", async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get("/api/classes");
        return res.data.data;
    } catch (err) {
        if (isAxiosError(err)) {
            return rejectWithValue(
                err.response?.data?.message || "Sınıflar alınamadı"
            );
        }
        return rejectWithValue("Bilinmeyen hata");
    }
});

export const deleteClassById = createAsyncThunk<
    void,
    string,
    { rejectValue: string }
>("adminClasses/deleteClass", async (classId, { rejectWithValue }) => {
    try {
        await axiosInstance.post("/api/classes/delete", { _id: classId });
    } catch (err) {
        if (isAxiosError(err)) {
            return rejectWithValue(
                err.response?.data?.message || "Sınıf silinemedi"
            );
        }
        return rejectWithValue("Bilinmeyen hata");
    }
});
export const fetchAllStudentClasses = createAsyncThunk<
    any[],
    void,
    { rejectValue: string }
>("adminClasses/fetchAllStudentClasses", async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get("/api/studentClasses");
        return res.data.data;
    } catch (err) {
        return rejectWithValue("Öğrenci-sınıf verisi alınamadı");
    }
});