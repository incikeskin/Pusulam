import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

/* -------------------------------
 * 1️⃣ ÖDEV + SORULARI GETİR
 * GET /assignments/:id/full
 * ------------------------------- */
export const fetchAssignmentFull = createAsyncThunk(
    "assignmentDetail/fetchAssignmentFull",
    async (assignmentId: string, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/api/assignments/${assignmentId}/full`);
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Ödev getirilemedi");
        }
    }
);

/* -------------------------------
 * 2️⃣ ÖDEV BİLGİSİNİ GÜNCELLE
 * POST /assignments/update
 * ------------------------------- */
export const updateAssignment = createAsyncThunk(
    "assignmentDetail/updateAssignment",
    async (payload: {
        _id: string;
        title?: string;
        description?: string;
        due_date?: string;
        is_active?: boolean;
    }, { rejectWithValue }) => {
        try {
            await axiosInstance.post("/api/assignments/update", payload);
            return payload;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Ödev güncellenemedi");
        }
    }
);

/* -------------------------------
 * 3️⃣ ÖDEVE SORU EKLE
 * POST /assignmentQuestions/add
 * ------------------------------- */
export const addQuestionToAssignment = createAsyncThunk(
    "assignmentDetail/addQuestionToAssignment",
    async (payload: { assignmentId: string; questionId: string }, { rejectWithValue }) => {
        try {
            await axiosInstance.post("/api/assignmentQuestions/add", {
                assignment: payload.assignmentId,
                question: payload.questionId,
            });
            return payload.questionId;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Soru eklenemedi");
        }
    }
);

/* -------------------------------
 * 4️⃣ ÖDEV-SORU İLİŞKİSİNİ SİL
 * POST /assignmentQuestions/delete
 * ------------------------------- */
export const removeQuestionFromAssignment = createAsyncThunk(
    "assignmentDetail/removeQuestionFromAssignment",
    async (assignmentQuestionId: string, { rejectWithValue }) => {
        try {
            await axiosInstance.post("/api/assignmentQuestions/delete", {
                _id: assignmentQuestionId,
            });
            return assignmentQuestionId;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Soru silinemedi");
        }
    }
);