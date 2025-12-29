import { createSlice } from "@reduxjs/toolkit";
import { fetchUsersByRole } from "./adminThunks";

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
            });
    },
});

export default adminUsersSlice.reducer;
