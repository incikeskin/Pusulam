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

        /* 1️⃣ ÖDEV OLUŞTUR */
        const assignmentRes = await axiosInstance.post("/api/assignments/add", {
          title: state.form.title,
          description: state.form.description,
          due_date: state.form.due_date || null,
          class: classId,
          teacher: teacherId,
        });

        const assignmentId =
            assignmentRes.data?.data?._id ?? assignmentRes.data._id;

        if (!assignmentId) throw new Error("Assignment ID alınamadı");

        /* 2️⃣ HAVUZDAN SEÇİLEN SORULAR */
        for (const questionId of state.selectedQuestionIds) {
          try {
            await axiosInstance.post("/api/assignmentQuestions/add", {
              assignment: assignmentId,
              question: questionId,
            });
          } catch (err) {
            console.error("Havuz sorusu eklenemedi:", questionId, err);
          }
        }

        /* 3️⃣ TASLAKTAN EKLENEN YENİ SORULAR */
        for (const q of state.newQuestions) {
          // 3.1 Soru oluştur
          const questionRes = await axiosInstance.post("/api/questions/add", {
            text: q.text,
            category: q.category, // seçilen kategori
            difficulty: q.difficulty || "medium",
          });

          const newQuestionId =
              questionRes.data?.data?._id ?? questionRes.data._id;

          if (!newQuestionId) throw new Error("Yeni soru ID alınamadı");

          // 3.2 Şıkları ekle
          if (q.options?.length) {
            for (const opt of q.options) {
              if (!opt.text || !opt.text.trim()) {
                console.warn("Boş şık atlandı:", opt);
                continue;
              }
              try {
                await axiosInstance.post("/api/options/add", {
                  question: newQuestionId,
                  text: opt.text,
                  is_correct: opt.is_correct,
                });
              } catch (err) {
                console.error("Şık eklenemedi:", opt, err);
              }
            }
          }

          // 3.3 Soruyu ödeve bağla
          try {
            await axiosInstance.post("/api/assignmentQuestions/add", {
              assignment: assignmentId,
              question: newQuestionId,
            });
          } catch (err) {
            console.error("Yeni soru ödeve bağlanamadı:", newQuestionId, err);
          }
        }

        /* 4️⃣ STATE RESET */
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

