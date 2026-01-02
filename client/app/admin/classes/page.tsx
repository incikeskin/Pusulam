"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllClasses,
    deleteClassById,
    fetchAllStudentClasses,
} from "@/redux/admin-classes-store/adminClassesThunks";
import { createClass } from "@/redux/create-class-store/createClassThunks";
import { RootState, AppDispatch } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminClassesPage() {
    const dispatch = useDispatch<AppDispatch>();

    const { classes, studentClasses, loading } = useSelector(
        (state: RootState) => state.adminClasses
    );

    const [search, setSearch] = useState("");
    const [newClassName, setNewClassName] = useState("");

    useEffect(() => {
        dispatch(fetchAllClasses());
        dispatch(fetchAllStudentClasses());
    }, [dispatch]);

    const filtered = classes.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    // 🔹 Öğrenci sayısı helper
    const getStudentCount = (classId: string) =>
        studentClasses.filter((sc) => sc.class._id === classId).length;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Sınıflar</h1>

            {/* ➕ SINIF EKLEME */}
            <div className="flex gap-2 mb-6 max-w-md">
                <Input
                    placeholder="Yeni sınıf adı"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                />
                <Button
                    onClick={() => {
                        if (!newClassName.trim()) return;
                        dispatch(createClass({ name: newClassName }));
                        setNewClassName("");
                        dispatch(fetchAllClasses());
                    }}
                >
                    Sınıf Ekle
                </Button>
            </div>

            {/* 🔍 ARAMA */}
            <Input
                placeholder="Sınıf ara..."
                className="mb-4 max-w-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* 📋 SINIF LİSTESİ */}
            <div className="space-y-3">
                {filtered.map((cls) => (
                    <div
                        key={cls._id}
                        className="flex items-center justify-between border p-4 rounded"
                    >
                        <div>
                            <p className="font-semibold">{cls.name}</p>

                            <p className="text-sm text-gray-500">
                                👥 Öğrenci Sayısı: {getStudentCount(cls._id)}
                            </p>

                            <p className="text-sm text-gray-500">
                                👨‍🏫 Öğretmen:{" "}
                                {cls.teacher
                                    ? `${cls.teacher.first_name} ${cls.teacher.last_name}`
                                    : "—"}
                            </p>
                        </div>

                        <Button
                            variant="destructive"
                            onClick={() => dispatch(deleteClassById(cls._id))}
                        >
                            Sil
                        </Button>
                    </div>
                ))}
            </div>

            {loading && <p className="mt-4 text-gray-500">Yükleniyor...</p>}
        </div>
    );
}
