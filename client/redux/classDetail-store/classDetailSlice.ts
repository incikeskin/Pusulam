// redux/classDetail-store/classDetailSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { ClassDetailState } from "@/redux/types";
import {
  fetchClassInfo,
  fetchClassStudents,
  fetchClassAssignments
} from "./classDetailThunks";

const initialState: ClassDetailState = {
  info: null,
  students: [],
  assignments: [],
  loading: false,
  error: null
};

const classDetailSlice = createSlice({
  name: "classDetail",
  initialState,
  reducers: {
    clearClassDetail(state) {
      state.info = null;
      state.students = [];
      state.assignments = [];
      state.loading = false;
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    // ----------------------------
    // 1) CLASS INFO
    // ----------------------------
    builder.addCase(fetchClassInfo.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchClassInfo.fulfilled, (state, action) => {
      console.log("STUDENTS PAYLOAD:", action.payload);
      state.loading = false;
      state.info = action.payload;
    });
    builder.addCase(fetchClassInfo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Sınıf bilgisi alınamadı";
    });

    // ----------------------------
    // 2) CLASS STUDENTS
    // ----------------------------
    builder.addCase(fetchClassStudents.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchClassStudents.fulfilled, (state, action) => {
      state.loading = false;
      state.students = action.payload;
    });
    builder.addCase(fetchClassStudents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Öğrenci listesi alınamadı";
    });

    // ----------------------------
    // 3) CLASS ASSIGNMENTS
    // ----------------------------
    builder.addCase(fetchClassAssignments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchClassAssignments.fulfilled, (state, action) => {
      state.loading = false;
      state.assignments = action.payload;
    });
    builder.addCase(fetchClassAssignments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Ödevler alınamadı";
    });
  }
});

export const { clearClassDetail } = classDetailSlice.actions;

export default classDetailSlice.reducer;
