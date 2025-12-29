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

/* =======================
   CREATE USER
======================= */
export const createUser = createAsyncThunk(
    "admin/createUser",
    async (data: {
        email: string;
        password: string;
        first_name?: string;
        last_name?: string;
        phone_number?: string;
        role: "student" | "teacher" | "Admin";
    }, { rejectWithValue }) => {
        try {
            await axiosInstance.post("/api/users/register", data);
            return true;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Create user error");
        }
    }
);

/* =======================
   DELETE USER
======================= */
export const deleteUser = createAsyncThunk(
    "admin/deleteUser",
    async (userId: string, { rejectWithValue }) => {
        try {
            await axiosInstance.post("/api/users/delete", { _id: userId });
            return userId;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Delete user error");
        }
    }
);
