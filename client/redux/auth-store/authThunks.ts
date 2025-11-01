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


