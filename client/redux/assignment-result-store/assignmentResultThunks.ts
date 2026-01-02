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
export const checkAssignmentCompleted = createAsyncThunk(
    "assignmentResult/checkAssignmentCompleted",
    async (
        { assignmentId, studentId }: { assignmentId: string; studentId: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.get(
                `/api/studentAnswers/list-by-student/${assignmentId}/${studentId}`
            );

            return {
                assignmentId,
                isCompleted: res.data.data.length > 0,
            };
        } catch (err: any) {
            return rejectWithValue("Kontrol edilemedi");
        }
    }
);


// Tek öğrenci için ödev sıralaması
export const fetchClassRanking = createAsyncThunk(
    "assignmentResults/fetchClassRanking",
    async (
        { assignmentId, classId, studentId }: { assignmentId: string; classId: string; studentId: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.get(
                `/api/studentAnswers/class-ranking/${assignmentId}/${classId}/${studentId}`
            );
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Sınıf sıralaması getirilemedi");
        }
    }
);

// Tüm sınıf sıralama listesi
export const fetchClassRankingList = createAsyncThunk(
    "assignmentResults/fetchClassRankingList",
    async (
        { assignmentId, classId }: { assignmentId: string; classId: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.get(
                `/api/studentAnswers/class-ranking-list/${assignmentId}/${classId}`
            );
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Sınıf sıralama listesi getirilemedi");
        }
    }
);

export const addStudentAnswer = createAsyncThunk(
    "assignmentResult/addStudentAnswer",
    async (
        {
            studentId,
            assignmentId,
            questionId,
            selectedOptionId,
        }: {
            studentId: string;
            assignmentId: string;
            questionId: string;
            selectedOptionId: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.post("/api/studentAnswers/add", {
                student: studentId,
                assignment: assignmentId,
                question: questionId,
                selected_option: selectedOptionId,
            });

            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Cevap kaydedilemedi"
            );
        }
    }
);
