import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Backend URL
const API_BASE_URL = "http://172.16.80.100:5000";

// Axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔐 REQUEST INTERCEPTOR (token ekleme)
axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem("token");

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.log("Token alınamadı:", error);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ❌ RESPONSE INTERCEPTOR (opsiyonel)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        // örnek: token expired handling
        if (error.response?.status === 401) {
            console.log("Unauthorized - token geçersiz");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;