import { createSlice } from "@reduxjs/toolkit";

import {
    fetchCompletionRate,
    fetchMostWrongQuestions,
    fetchStudentPerformanceTrend,
    fetchClassPerformanceTrend,
    fetchGeneralLeaderboard
} from "./analyticsThunks";

/* ---------------- TYPES ---------------- */

interface CompletionRate {
    assignmentId: string;
    classId: string;
    totalStudents: number;
    completedCount: number;
    notCompletedCount: number;
    completionRate: number;
}

interface WrongQuestion {
    questionId: string;
    text: string;
    difficulty: string;
    wrongCount: number;
}

interface StudentPerformanceItem {
    assignmentId: string;
    title: string;
    score: number;
}

interface StudentPerformanceTrend {
    studentId: string;
    trend: "up" | "down" | "stable";
    performance: StudentPerformanceItem[];
}

interface ClassPerformanceItem {
    assignmentId: string;
    title: string;
    averageScore: number;
    participantCount: number;
}

interface ClassPerformanceTrend {
    classId: string;
    trend: "up" | "down" | "stable";
    assignments: ClassPerformanceItem[];
}

interface LeaderboardItem {
    studentId: string;
    first_name: string;
    last_name: string;
    totalCorrect: number;
    totalAnswered: number;
    score: number;
    rank: number;
}

interface GeneralLeaderboard {
    classAverage: number;
    totalStudents: number;
    leaderboard: LeaderboardItem[];
}

/* ---------------- STATE ---------------- */

interface AnalyticsState {

    completionRate: CompletionRate | null;

    mostWrongQuestions: WrongQuestion[];

    studentPerformanceTrend: StudentPerformanceTrend | null;

    classPerformanceTrend: ClassPerformanceTrend | null;

    generalLeaderboard: GeneralLeaderboard | null;

    loading: boolean;

    error: string | null;
}

/* ---------------- INITIAL STATE ---------------- */

const initialState: AnalyticsState = {

    completionRate: null,

    mostWrongQuestions: [],

    studentPerformanceTrend: null,

    classPerformanceTrend: null,

    generalLeaderboard: null,

    loading: false,

    error: null
};

/* ---------------- SLICE ---------------- */

const analyticsSlice = createSlice({
    name: "analytics",

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        /* -------- COMPLETION RATE -------- */

        builder
            .addCase(fetchCompletionRate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompletionRate.fulfilled, (state, action) => {
                state.loading = false;
                state.completionRate = action.payload;
            })
            .addCase(fetchCompletionRate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        /* -------- MOST WRONG QUESTIONS -------- */

        builder
            .addCase(fetchMostWrongQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMostWrongQuestions.fulfilled, (state, action) => {
                state.loading = false;
                state.mostWrongQuestions = action.payload;
            })
            .addCase(fetchMostWrongQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        /* -------- STUDENT PERFORMANCE TREND -------- */

        builder
            .addCase(fetchStudentPerformanceTrend.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentPerformanceTrend.fulfilled, (state, action) => {
                state.loading = false;
                state.studentPerformanceTrend = action.payload;
            })
            .addCase(fetchStudentPerformanceTrend.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        /* -------- CLASS PERFORMANCE TREND -------- */

        builder
            .addCase(fetchClassPerformanceTrend.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClassPerformanceTrend.fulfilled, (state, action) => {
                state.loading = false;
                state.classPerformanceTrend = action.payload;
            })
            .addCase(fetchClassPerformanceTrend.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        /* -------- GENERAL LEADERBOARD -------- */

        builder
            .addCase(fetchGeneralLeaderboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGeneralLeaderboard.fulfilled, (state, action) => {
                state.loading = false;
                state.generalLeaderboard = action.payload;
            })
            .addCase(fetchGeneralLeaderboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export default analyticsSlice.reducer;