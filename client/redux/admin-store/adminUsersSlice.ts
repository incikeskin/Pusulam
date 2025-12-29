import { createSlice } from "@reduxjs/toolkit";
import { fetchUsersByRole, deleteUser } from "./adminThunks";

interface AdminUsersState {
    loading: boolean;
    error: string | null;
    students: any[];
    teachers: any[];
    admins: any[];
}

const initialState: AdminUsersState = {
    loading: false,
    error: null,
    students: [],
    teachers: [],
    admins: [],
};

const adminUsersSlice = createSlice({
    name: "adminUsers",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsersByRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsersByRole.fulfilled, (state, action) => {
                state.loading = false;
                const { role, users } = action.payload;

                if (role === "student") state.students = users;
                if (role === "teacher") state.teachers = users;
                if (role === "Admin") state.admins = users;
            })
            .addCase(fetchUsersByRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.students = state.students.filter(u => u._id !== action.payload);
                state.teachers = state.teachers.filter(u => u._id !== action.payload);
                state.admins = state.admins.filter(u => u._id !== action.payload);
            });

    },
});

export default adminUsersSlice.reducer;
