import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

/* -----------------------------------
 * 📊 ÖDEV TAMAMLAMA ORANI
 * GET /completion-rate/:assignmentId/:classId
 * ----------------------------------- */
export const fetchCompletionRate = createAsyncThunk(
    "analytics/fetchCompletionRate",
    async (
        {
            assignmentId,
            classId
        }: {
            assignmentId: string;
            classId: string;
        },
        { rejectWithValue }
    ) => {
        try {

            const res = await axiosInstance.get(
                `/api/studentAnswers/completion-rate/${assignmentId}/${classId}`
            );

            return res.data.data;

        } catch (err: any) {

            return rejectWithValue(
                err.response?.data?.message ||
                "Tamamlama oranı getirilemedi"
            );
        }
    }
);

/* -----------------------------------
 * 📊 EN ÇOK YANLIŞ YAPILAN SORULAR
 * GET /most-wrong-questions/:assignmentId
 * ----------------------------------- */
export const fetchMostWrongQuestions = createAsyncThunk(
    "analytics/fetchMostWrongQuestions",

    async (
        assignmentId: string,
        { rejectWithValue }
    ) => {

        try {

            const res = await axiosInstance.get(
                `/api/studentAnswers/most-wrong-questions/${assignmentId}`
            );

            return res.data.data;

        } catch (err: any) {

            return rejectWithValue(
                err.response?.data?.message ||
                "Yanlış sorular getirilemedi"
            );
        }
    }
);

/* -----------------------------------
 * 📈 ÖĞRENCİ PERFORMANS TRENDİ
 * GET /student-performance-trend/:classId/:studentId
 * ----------------------------------- */
export const fetchStudentPerformanceTrend = createAsyncThunk(
    "analytics/fetchStudentPerformanceTrend",

    async (
        {
            classId,
            studentId
        }: {
            classId: string;
            studentId: string;
        },
        { rejectWithValue }
    ) => {

        try {

            const res = await axiosInstance.get(
                `/api/studentAnswers/student-performance-trend/${classId}/${studentId}`
            );

            return res.data.data;

        } catch (err: any) {

            return rejectWithValue(
                err.response?.data?.message ||
                "Öğrenci performans trendi getirilemedi"
            );
        }
    }
);

/* -----------------------------------
 * 📈 SINIF PERFORMANS TRENDİ
 * GET /class-performance-trend/:classId
 * ----------------------------------- */
export const fetchClassPerformanceTrend = createAsyncThunk(
    "analytics/fetchClassPerformanceTrend",

    async (
        classId: string,
        { rejectWithValue }
    ) => {

        try {

            const res = await axiosInstance.get(
                `/api/studentAnswers/class-performance-trend/${classId}`
            );

            return res.data.data;

        } catch (err: any) {

            return rejectWithValue(
                err.response?.data?.message ||
                "Sınıf performans trendi getirilemedi"
            );
        }
    }
);

/* -----------------------------------
 * 🏆 GENEL LEADERBOARD
 * GET /general-leaderboard/:classId
 * ----------------------------------- */
export const fetchGeneralLeaderboard = createAsyncThunk(
    "analytics/fetchGeneralLeaderboard",

    async (
        classId: string,
        { rejectWithValue }
    ) => {

        try {

            const res = await axiosInstance.get(
                `/api/studentAnswers/general-leaderboard/${classId}`
            );

            return res.data.data;

        } catch (err: any) {

            return rejectWithValue(
                err.response?.data?.message ||
                "Genel leaderboard getirilemedi"
            );
        }
    }
);