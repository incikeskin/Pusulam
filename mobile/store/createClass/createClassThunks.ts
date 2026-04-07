// redux/create-class-store/classCreateThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import type { ClassItem } from "@/store/types";
import { isAxiosError } from "axios";

export const createClass = createAsyncThunk<
    ClassItem,
    { name: string },
    { rejectValue: string }
>("classCreate/createClass", async ({ name }, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post("/api/classes/add", { name });
        return res.data.data as ClassItem;
    } catch (err) {
        if (isAxiosError(err)) {
            return rejectWithValue(
                err.response?.data?.message || "Sınıf oluşturulamadı"
            );
        }
        return rejectWithValue("Bilinmeyen bir hata oluştu");
    }
});