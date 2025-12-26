// redux/student-store/studentThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { Class } from "./types";

export const getStudentClasses = createAsyncThunk<
    Class[],
    void,
    { rejectValue: string }
>("student/getStudentClasses", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get("/api/studentClasses/my-classes");

        const classes: Class[] = response.data.data.map((sc: any) => ({
            _id: sc.class._id,
            name: sc.class.name,
            studentCount: sc.class.studentCount || 0,
        }));

        return classes;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || "Sınıflar yüklenemedi");
    }
});

