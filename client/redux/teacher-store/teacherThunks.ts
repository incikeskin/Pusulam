// redux/teacher-store/teacherThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance"; // senin axios instance yolu
import { isAxiosError, AxiosError } from "axios";
import type { RootState } from "@/redux/store";

export type ClassItem = {
  _id: string;
  name: string;
  teacher?: {
    _id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  } | null;
  is_active?: boolean;
  // diğer alanlar varsa ekle
};

// Fetch all classes, then filter client-side for current teacher
export const getTeacherClasses = createAsyncThunk<
  ClassItem[], // dönecek veri tipi
  void, // arg tipi
  { state: RootState; rejectValue: string }
>("teacher/getTeacherClasses", async (_, { getState, rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("/api/classes");
    const data = res.data?.data ?? res.data; // backend formatına göre ayarla
    // get current teacher id from auth state (if present)
    const state = getState();
    const currentUserId = state.auth?.user?._id || state.auth?.user?._id || null;

    if (currentUserId) {
      const filtered = (data as ClassItem[]).filter((c) => {
        const tid = c.teacher?._id ?? (c.teacher as any)?.id ?? (c.teacher as any)?._id;
        return String(tid) === String(currentUserId);
      });
      return filtered;
    }

    // if no current user in state, return all (or empty)
    return data as ClassItem[];
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosErr.response?.data?.message || "Sınıflar alınamadı");
    }
    return rejectWithValue("Sınıflar alınırken bilinmeyen bir hata oluştu");
  }
});
