// src/api/api.ts
const API_BASE_URL = "http://192.168.1.180:5000"; // backend IP + portu güncelle

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

export const apiFetch = async (endpoint: string, options: FetchOptions = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};