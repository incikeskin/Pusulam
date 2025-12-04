import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance"; // senin custom instance
import axios, { AxiosError, isAxiosError } from "axios"; // orijinal axios ve isAxiosError
import type { User } from "../types";

// Login thunk
export const loginUser = createAsyncThunk<
  { user: User; token: string }, // resolve tipi
  { email: string; password: string }, // input tipi
  { rejectValue: string } // hata tipi
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/api/users/auth", credentials);
    const { token, user } = response.data.data; // Response format: { data: { token, user } }
    localStorage.setItem("token", token);
    return { user, token };
  } catch (err: unknown) {
    // Type-safe axios hatası kontrolü
    if (isAxiosError(err)) {
      const axiosErr = err as AxiosError<{ message: string }>;
      return rejectWithValue(axiosErr.response?.data?.message || "Login failed");
    }
    return rejectWithValue("Login failed");
  }
});

// REGISTER thunk
export const registerUser = createAsyncThunk<
  { success: boolean },                                // resolve tipi
  {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone_number?: string;
  },                                                   // input tipi
  { rejectValue: string }                              // hata tipi
>("auth/registerUser", async (formData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/api/users/register", formData);

    // backend: { success: true } dönüyor
    return { success: true };
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      const axiosErr = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosErr.response?.data?.message || "Register failed"
      );
    }
    return rejectWithValue("Register failed");
  }
});

// USER PROFILE UPDATE THUNK
export const updateUserProfile = createAsyncThunk<
  User, // resolve tipi: güncellenmiş user
  Partial<{ _id: string; first_name?: string; last_name?: string; password?: string; phone_number?: string }>, // input tipi
  { rejectValue: string }
>(
  "auth/updateUserProfile",
  async (updatedData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/users/update", updatedData);
      // backend response: { success: true }
      // biz güncellenmiş user'ı tekrar fetch etmeliyiz veya local state'i güncelle
      // varsayılan olarak localStorage'daki user'ı güncelleyelim
      const updatedUser = { ...JSON.parse(localStorage.getItem("user") || "{}"), ...updatedData };
      return updatedUser as User;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        return rejectWithValue(axiosErr.response?.data?.message || "Güncelleme başarısız");
      }
      return rejectWithValue("Güncelleme başarısız");
    }
  }
);

