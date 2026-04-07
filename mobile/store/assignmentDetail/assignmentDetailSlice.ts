import { createSlice } from "@reduxjs/toolkit";
import {
    fetchAssignmentFull,
    updateAssignment,
    addQuestionToAssignment,
    removeQuestionFromAssignment,
} from "./assignmentDetailThunks";

/* ---------------- TYPES ---------------- */

export interface QuestionOption {
    _id: string;
    text: string;
    is_correct?: boolean;
    image?: string;
}

export interface AssignmentQuestion {
    _id: string; // assignmentQuestions._id
    question: {
        _id: string;
        text: string;
        image?: string;
        difficulty?: string;
        category?: string;
        options?: QuestionOption[];
    };
}

export interface Assignment {
    _id: string;
    title: string;
    description?: string;
    due_date?: string;
    class?: {
        _id: string;
        name: string;
    };
    teacher?: {
        _id: string;
        first_name: string;
        last_name: string;
    };
}

interface AssignmentDetailState {
    assignment: Assignment | null;
    questions: AssignmentQuestion[];
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
            /* FETCH FULL */
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
                state.error = action.error.message || "Bir hata oluştu";
            })

            /* UPDATE ASSIGNMENT */
            .addCase(updateAssignment.fulfilled, (state, action) => {
                if (state.assignment) {
                    state.assignment = {
                        ...state.assignment,
                        ...action.payload,
                    };
                }
            })

            /* ADD QUESTION */
            .addCase(addQuestionToAssignment.fulfilled, () => {
                // ❗ Bilinçli olarak BOŞ
                // ➜ eklemeden sonra fetchAssignmentFull çağrılacak
            })

            /* REMOVE QUESTION */
            .addCase(removeQuestionFromAssignment.fulfilled, (state, action) => {
                state.questions = state.questions.filter(
                    (q) => q._id !== action.payload
                );
            });
    },
});

export default assignmentDetailSlice.reducer;

