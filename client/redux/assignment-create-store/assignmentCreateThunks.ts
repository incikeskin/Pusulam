// redux/assignment-create-store/assignmentCreateThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { isAxiosError, AxiosError } from "axios";
import { RootState } from "@/redux/store";
import { resetAssignmentCreateState } from "./assignmentCreateSlice";

interface CreateAssignmentArgs {
  classId: string;
  teacherId: string;
}

export const createAssignment = createAsyncThunk<
  void,
  CreateAssignmentArgs,
  { state: RootState; rejectValue: string }
>(
  "assignmentCreate/createAssignment",
  async ({ classId, teacherId }, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState().assignmentCreate;

      // 1️⃣ Ödev oluştur
      const assignmentRes = await axiosInstance.post("/api/assignments/add", {
        title: state.form.title,
        description: state.form.description,
        due_date: state.form.due_date || null,
        class: classId,
        teacher: teacherId,
      });

      const assignmentId =
        assignmentRes.data?.data?._id ?? assignmentRes.data._id;

      // 2️⃣ Havuzdan seçilen sorular
      for (const questionId of state.selectedQuestionIds) {
        await axiosInstance.post("/api/assignmentQuestions/add", {
          assignment: assignmentId,
          question: questionId,
        });
      }

      // 3️⃣ Yeni sorular
      for (const q of state.newQuestions) {
        const questionRes = await axiosInstance.post("/api/questions/add", {
          text: q.text,
          difficulty: q.difficulty || "medium",
        });

        const newQuestionId =
          questionRes.data?.data?._id ?? questionRes.data._id;

        if (q.options?.length) {
          for (const opt of q.options) {
            await axiosInstance.post("/api/options/add", {
              question: newQuestionId,
              text: opt.text,
              is_correct: opt.is_correct,
            });
          }
        }

        await axiosInstance.post("/api/assignmentQuestions/add", {
          assignment: assignmentId,
          question: newQuestionId,
        });
      }

      dispatch(resetAssignmentCreateState());
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        return rejectWithValue(
          axiosErr.response?.data?.message || "Ödev oluşturulamadı"
        );
      }
      return rejectWithValue("Bilinmeyen bir hata oluştu");
    }
  }
);
