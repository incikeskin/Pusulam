import { createSlice } from "@reduxjs/toolkit";
import {
    fetchStudentResult,
    fetchOverallRating,
    fetchStudentAnswers,
    checkAssignmentCompleted,
    fetchClassRanking,
    fetchClassRankingList,
} from "./assignmentResultThunks";

/* ---------------- TYPES ---------------- */

interface StudentResult {
    total: number;
    correct: number;
    incorrect: number;
    score_percent: number;
}

interface OverallRating {
    totalQuestions: number;
    totalCorrect: number;
    totalIncorrect: number;
    score_percent: number;
}

interface StudentAnswer {
    _id: string;
    question: {
        _id: string;
        text: string;
        image?: string;
    };
    selected_option: {
        _id: string;
        text: string;
        is_correct: boolean;
    };
    is_correct: boolean;
}

interface ClassRanking {
    studentId: string;
    studentScore: number;
    classAverage: number;
    rank: number;
    totalStudents: number;
}

interface ClassRankingListItem {
    studentId: string;
    first_name: string;
    last_name: string;
    score: number;
    rank: number;
}

interface ClassRankingList {
    classAverage: number;
    totalStudents: number;
    ranking: ClassRankingListItem[];
}

interface AssignmentResultsState {
    studentResult: StudentResult | null;
    overallRating: OverallRating | null;
    completedMap: Record<string, boolean>;
    studentAnswers: StudentAnswer[];
    classRanking: ClassRanking | null;
    classRankingList: ClassRankingList | null;
    loading: boolean;
    error: string | null;
}

/* ---------------- INITIAL STATE ---------------- */

const initialState: AssignmentResultsState = {
    studentResult: null,
    overallRating: null,
    completedMap: {},
    studentAnswers: [],
    classRanking: null,
    classRankingList: null,
    loading: false,
    error: null,
};

/* ---------------- SLICE ---------------- */

const assignmentResultsSlice = createSlice({
    name: "assignmentResult",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        /* -------- STUDENT RESULT -------- */
        builder
            .addCase(fetchStudentResult.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentResult.fulfilled, (state, action) => {
                state.loading = false;
                state.studentResult = action.payload;
            })
            .addCase(fetchStudentResult.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        /* -------- OVERALL RATING -------- */
        builder
            .addCase(fetchOverallRating.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOverallRating.fulfilled, (state, action) => {
                state.loading = false;
                state.overallRating = action.payload;
            })
            .addCase(fetchOverallRating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        /* -------- STUDENT ANSWERS -------- */
        builder
            .addCase(fetchStudentAnswers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentAnswers.fulfilled, (state, action) => {
                state.loading = false;
                state.studentAnswers = action.payload;
            })
            .addCase(fetchStudentAnswers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        builder.addCase(checkAssignmentCompleted.fulfilled, (state, action) => {
            state.completedMap[action.payload.assignmentId] =
                action.payload.isCompleted;
        });

        /* -------- CLASS RANKING -------- */
        builder
            .addCase(fetchClassRanking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClassRanking.fulfilled, (state, action) => {
                state.loading = false;
                state.classRanking = action.payload;
            })
            .addCase(fetchClassRanking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        /* -------- CLASS RANKING LIST -------- */
        builder
            .addCase(fetchClassRankingList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClassRankingList.fulfilled, (state, action) => {
                state.loading = false;
                state.classRankingList = action.payload;
            })
            .addCase(fetchClassRankingList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

    },
});

export default assignmentResultsSlice.reducer;
