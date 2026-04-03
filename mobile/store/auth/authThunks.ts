import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError, isAxiosError } from "axios";
import type { User } from "../types";

// LOGIN
export const loginUser = createAsyncThunk<
    { user: User; token: string },
    { email: string; password: string },
    { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/api/users/auth", credentials);

        console.log("Backend cevabı:", response.data); // test için log

        const data = response.data.data; // artık direkt { token, user }

        const token = data.token;
        const user = data.user;

        if (!token || !user) {
            return rejectWithValue("Token veya user bilgisi eksik");
        }

        // AsyncStorage
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));

        return { user, token };
    } catch (err: unknown) {
        if (isAxiosError(err)) {
            const axiosErr = err as AxiosError<{ message: string }>;
            return rejectWithValue(
                axiosErr.response?.data?.message || "Login failed"
            );
        }
        return rejectWithValue("Login failed");
    }
});

// REGISTER
export const registerUser = createAsyncThunk<
    { success: boolean },
    {
        email: string;
        password: string;
        first_name?: string;
        last_name?: string;
        phone_number?: string;
        role?: string;
    },
    { rejectValue: string }
>("auth/registerUser", async (userData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/api/users/register", userData);

        return response.data.data; // { success: true }
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