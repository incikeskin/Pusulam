import { createSlice } from "@reduxjs/toolkit";
import {
    fetchAssignmentFull,
    updateAssignment,
    addQuestionToAssignment,
    removeQuestionFromAssignment,
} from "./assignmentDetailThunks";

/* ---------------- TYPES ---------------- */

interface Assignment {
    _id: string;
    title: string;
    description?: string;
    due_date?: string | null;
    class: string;
    teacher: string;
}

interface QuestionOption {
    _id: string;
    text: string;
    is_correct: boolean;
}

interface Question {
    _id: string;
    text: string;
    category?: string;
    difficulty?: string;
    options?: QuestionOption[];
}

interface AssignmentDetailState {
    assignment: Assignment | null;
    questions: Question[];
    loading: boolean;
    error: string | null;
}

/* ---------------- INITIAL STATE ---------------- */

const initialState: AssignmentDetailState = {
    assignment: null,
    questions: [],
    loading: false,
    error: null,
};

/* ---------------- SLICE ---------------- */

const assignmentDetailSlice = createSlice({
    name: "assignmentDetail",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            /* ---------- FETCH FULL ---------- */
            .addCase(fetchAssignmentFull.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssignmentFull.fulfilled, (state, action) => {
                state.loading = false;
                state.assignment = action.payload.assignment;
                state.questions = action.payload.questions;
            })
            .addCase(fetchAssignmentFull.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            /* ---------- UPDATE ASSIGNMENT ---------- */
            .addCase(updateAssignment.fulfilled, (state, action) => {
                if (state.assignment) {
                    state.assignment = {
                        ...state.assignment,
                        ...action.payload,
                    };
                }
            })

            /* ---------- ADD QUESTION ---------- */
            .addCase(addQuestionToAssignment.fulfilled, (state) => {
                // 👉 burada state’i elle güncellemiyoruz
                // 👉 işlem sonrası fetchAssignmentFull çağrılması daha sağlıklı
            })

            /* ---------- REMOVE QUESTION ---------- */
            .addCase(removeQuestionFromAssignment.fulfilled, (state) => {
                // 👉 aynı mantık
            });
    },
});

export default assignmentDetailSlice.reducer;

