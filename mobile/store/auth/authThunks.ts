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

        // Eğer response.data.data bir array ise -> user = array[0], token yoksa test için ayrı tut
        const data = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;

        const token = data.token; // token backend’den gelmiyorsa JWT oluşturma logic ile gelmeli
        const user = data.user || data; // user objesi yoksa data’yı user olarak al

        if (!token) {
            console.log("Token alınamadı");
            return rejectWithValue("Token alınamadı");
        }

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