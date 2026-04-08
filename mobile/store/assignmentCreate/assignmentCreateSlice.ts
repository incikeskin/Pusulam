// redux/assignment-create-store/assignmentCreateSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NewQuestionOption {
    text: string;
    is_correct: boolean;
}

export interface NewQuestion {
    text: string;
    category: string;
    difficulty?: "easy" | "medium" | "hard";
    options?: NewQuestionOption[]; // boşsa klasik soru
}

export interface AssignmentCreateState {
    form: {
        title: string;
        description: string;
        due_date: string;
    };
    selectedQuestionIds: string[]; // havuzdan seçilen sorular
    newQuestions: NewQuestion[];   // öğretmenin eklediği sorular
    loading: boolean;
    error: string | null;
}

const initialState: AssignmentCreateState = {
    form: {
        title: "",
        description: "",
        due_date: "",
    },
    selectedQuestionIds: [],
    newQuestions: [],
    loading: false,
    error: null,
};

const assignmentCreateSlice = createSlice({
    name: "assignmentCreate",
    initialState,
    reducers: {
        /* ---------------- FORM ---------------- */
        setFormField(
            state,
            action: PayloadAction<{
                field: keyof AssignmentCreateState["form"];
                value: string;
            }>
        ) {
            state.form[action.payload.field] = action.payload.value;
        },

        /* ---------------- QUESTION POOL ---------------- */
        addSelectedQuestion(state, action: PayloadAction<string>) {
            if (!state.selectedQuestionIds.includes(action.payload)) {
                state.selectedQuestionIds.push(action.payload);
            }
        },

        removeSelectedQuestion(state, action: PayloadAction<string>) {
            state.selectedQuestionIds = state.selectedQuestionIds.filter(
                (id) => id !== action.payload
            );
        },

        /* ---------------- NEW QUESTIONS ---------------- */
        addNewQuestion(state, action: PayloadAction<NewQuestion>) {
            state.newQuestions.push(action.payload);
        },

        removeNewQuestion(state, action: PayloadAction<number>) {
            state.newQuestions.splice(action.payload, 1);
        },

        /* ---------------- DRAFT ---------------- */
        loadDraft(
            _state,
            action: PayloadAction<AssignmentCreateState>
        ) {
            return action.payload;
        },

        clearDraft() {
            return initialState;
        },

        /* ---------------- RESET ---------------- */
        resetAssignmentCreateState() {
            return initialState;
        },
    },
});

export const {
    setFormField,
    addSelectedQuestion,
    removeSelectedQuestion,
    addNewQuestion,
    removeNewQuestion,
    loadDraft,
    clearDraft,
    resetAssignmentCreateState,
} = assignmentCreateSlice.actions;

export default assignmentCreateSlice.reducer;
