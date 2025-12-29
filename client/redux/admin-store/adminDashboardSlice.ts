import { createSlice } from "@reduxjs/toolkit";
import { fetchAdminDashboardStats } from "./adminThunks";

interface DashboardState {
    loading: boolean;
    error: string | null;
    stats: {
        classCount: number;
        assignmentCount: number;
        questionCount: number;
        studentCount: number;
        teacherCount: number;
        adminCount: number;
    } | null;
}

const initialState: DashboardState = {
    loading: false,
    error: null,
    stats: null,
};

const adminDashboardSlice = createSlice({
    name: "adminDashboard",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchAdminDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default adminDashboardSlice.reducer;
