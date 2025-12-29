import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

/* =======================
   DASHBOARD STATS
======================= */
export const fetchAdminDashboardStats = createAsyncThunk(
    "admin/fetchDashboardStats",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/api/admin/dashboard-stats");
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Dashboard error");
        }
    }
);

/* =======================
   USERS BY ROLE
======================= */
export const fetchUsersByRole = createAsyncThunk(
    "admin/fetchUsersByRole",
    async (role: "student" | "teacher" | "Admin", { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/api/admin/users?role=${role}`);
            return { role, users: res.data.data };
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "User fetch error");
        }
    }
);
