// redux/classDetail-store/classDetailThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance"; // projenize göre yolunu düzeltin
import { isAxiosError, AxiosError } from "axios";
import type {
  ClassItem,
  StudentClassRecord,
  AssignmentItem
} from "@/redux/types"; // types dosyasının gerçek yolunu kontrol edin

// Base endpoints (senin backend rotalarına göre)
const CLASSES_BASE = "/api/classes";
const STUDENT_CLASSES_BASE = "/api/student-classes";
const ASSIGNMENTS_BASE = "/api/assignments";

/**
 * 1) Sınıf temel bilgisi
 * GET /api/classes/:classId
 */
export const fetchClassInfo = createAsyncThunk<
  ClassItem,          // fulfilled dönecek tip
  string,             // arg: classId
  { rejectValue: string }
>("classDetail/fetchClassInfo", async (classId, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`${CLASSES_BASE}/${classId}`);
    // backend: { code:200, data: {...} } veya res.data.data olabilir
    const payload = res.data?.data ?? res.data;
    return payload as ClassItem;
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosErr.response?.data?.message || "Sınıf bilgisi alınamadı");
    }
    return rejectWithValue("Sınıf bilgisi alınırken bilinmeyen bir hata oluştu");
  }
});

/**
 * 2) Sınıftaki öğrenciler
 * GET /api/student-classes/list-by-class/:classId
 */
export const fetchClassStudents = createAsyncThunk<
  StudentClassRecord[], // fulfilled dönecek tip
  string,               // arg: classId
  { rejectValue: string }
>("classDetail/fetchClassStudents", async (classId, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`${STUDENT_CLASSES_BASE}/list-by-class/${classId}`);
    const payload = res.data?.data ?? res.data;
    return payload as StudentClassRecord[];
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosErr.response?.data?.message || "Öğrenciler alınamadı");
    }
    return rejectWithValue("Öğrenciler alınırken bilinmeyen bir hata oluştu");
  }
});

/**
 * 3) Sınıfa verilen ödevler
 * GET /api/assignments/list-by-class/:classId
 */
export const fetchClassAssignments = createAsyncThunk<
  AssignmentItem[], // fulfilled dönecek tip
  string,           // arg: classId
  { rejectValue: string }
>("classDetail/fetchClassAssignments", async (classId, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`${ASSIGNMENTS_BASE}/list-by-class/${classId}`);
    const payload = res.data?.data ?? res.data;
    return payload as AssignmentItem[];
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosErr.response?.data?.message || "Ödevler alınamadı");
    }
    return rejectWithValue("Ödevler alınırken bilinmeyen bir hata oluştu");
  }
});

