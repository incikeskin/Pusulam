
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { isAxiosError } from "axios";
import type { StudentSearchResult } from "./studentSearchTypes";

export const findStudent = createAsyncThunk<
    StudentSearchResult,
    { email?: string; phone_number?: string },
    { rejectValue: string }
>(
    "studentSearch/findStudent",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(
                "/api/users/find-student",
                payload
            );

            // backend: { code, data }
            return res.data.data as StudentSearchResult;
        } catch (err) {
            if (isAxiosError(err)) {
                return rejectWithValue(
                    err.response?.data?.message || "Öğrenci bulunamadı"
                );
            }
            return rejectWithValue("Bilinmeyen bir hata oluştu");
        }
    }
);