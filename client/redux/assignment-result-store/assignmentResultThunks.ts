import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

/* -------------------------------
 * 1️⃣ Tek öğrencinin ödev sonucu
 * GET /studentAnswers/result/:assignmentId/:studentId
 * ------------------------------- */
export const fetchStudentResult = createAsyncThunk(
    "assignmentResults/fetchStudentResult",
    async (
        { assignmentId, studentId }: { assignmentId: string; studentId: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.get(
                `/api/studentAnswers/result/${assignmentId}/${studentId}`
            );
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Öğrenci sonucu getirilemedi");
        }
    }
);

/* -------------------------------
 * 2️⃣ Sınıfın genel sonucu (ödevler toplamı)
 * GET /studentAnswers/overall-rating/:classId/:studentId
 * ------------------------------- */
export const fetchOverallRating = createAsyncThunk(
    "assignmentResults/fetchOverallRating",
    async (
        { classId, studentId }: { classId: string; studentId: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.get(
                `/api/studentAnswers/overall-rating/${classId}/${studentId}`
            );
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Sınıf genel sonucu getirilemedi");
        }
    }
);

/* -------------------------------
 * 3️⃣ Öğrencinin ödevdeki tüm cevapları
 * GET /studentAnswers/list-by-student/:assignmentId/:studentId
 * ------------------------------- */
export const fetchStudentAnswers = createAsyncThunk(
    "assignmentResult/fetchStudentAnswers",
    async (
        { assignmentId, studentId }: { assignmentId: string; studentId: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.get(
                `/api/studentAnswers/list-by-student/${assignmentId}/${studentId}`
            );
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Öğrenci cevapları getirilemedi"
            );
        }
    }
);
