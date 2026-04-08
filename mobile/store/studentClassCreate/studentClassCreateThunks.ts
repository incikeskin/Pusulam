// redux/studentClassCreate-store/studentClassCreateThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { isAxiosError } from "axios";

export const addStudentToClass = createAsyncThunk<
    void,
    { studentId: string; classId: string },
    { rejectValue: string }
>(
    "studentClassCreate/addStudentToClass",
    async ({ studentId, classId }, { rejectWithValue }) => {
        try {
            await axiosInstance.post("/api/studentClasses/add", {
                student: studentId,
                class: classId,
            });
        } catch (err) {
            if (isAxiosError(err)) {
                return rejectWithValue(
                    err.response?.data?.message || "Öğrenci sınıfa eklenemedi"
                );
            }
            return rejectWithValue("Bilinmeyen bir hata oluştu");
        }
    }
);
// 🔹 Yeni: Öğrenciyi sınıftan çıkarma
export const removeStudentFromClass = createAsyncThunk<
    void,
    { studentClassId: string },
    { rejectValue: string }
>(
    "studentClassCreate/removeStudentFromClass",
    async ({ studentClassId }, { rejectWithValue }) => {
        try {
            await axiosInstance.post("/api/studentClasses/delete", {
                _id: studentClassId,
            });
        } catch (err) {
            if (isAxiosError(err)) {
                return rejectWithValue(
                    err.response?.data?.message || "Öğrenci sınıftan çıkarılamadı"
                );
            }
            return rejectWithValue("Bilinmeyen bir hata oluştu");
        }
    }
);