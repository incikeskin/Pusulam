"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import { BookOpen, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    fetchClassInfo,
    fetchClassAssignments
} from "@/redux/classDetail-store/classDetailThunks";
import { clearClassDetail } from "@/redux/classDetail-store/classDetailSlice";

import { checkAssignmentCompleted } from "@/redux/assignment-result-store/assignmentResultThunks";
import type { User } from "@/redux/types";

export default function StudentClassDetailPage() {
    const { classId } = useParams<{ classId: string }>();
    const dispatch = useAppDispatch();

    const { info, assignments, loading, error } = useAppSelector(
        (state) => state.classDetail
    );

    const { user } = useAppSelector((state) => state.auth);
    const { completedMap } = useAppSelector(
        (state) => state.assignmentResult
    );

    /* ---------------- FETCH CLASS DATA ---------------- */
    useEffect(() => {
        if (!classId) return;

        dispatch(fetchClassInfo(classId));
        dispatch(fetchClassAssignments(classId));

        return () => {
            dispatch(clearClassDetail());
        };
    }, [classId, dispatch]);

    /* ---------------- CHECK ASSIGNMENT STATUS ---------------- */
    useEffect(() => {
        if (!assignments.length || !user?._id) return;

        assignments.forEach((assignment) => {
            dispatch(
                checkAssignmentCompleted({
                    assignmentId: assignment._id,
                    studentId: user._id,
                })
            );
        });
    }, [assignments, user, dispatch]);

    /* ---------------- TEACHER NAME ---------------- */
    const teacherName = useMemo(() => {
        if (!info?.teacher || typeof info.teacher === "string") return null;
        const teacher = info.teacher as User;
        return `${teacher.first_name} ${teacher.last_name}`;
    }, [info]);

    const completedCount = useMemo(() => {
        return assignments.filter(
            (a) => completedMap[a._id]
        ).length;
    }, [assignments, completedMap]);

    const progressPercent = useMemo(() => {
        if (assignments.length === 0) return 0;
        return Math.round((completedCount / assignments.length) * 100);
    }, [completedCount, assignments.length]);

    if (loading && !info) {
        return <p className="p-8 text-lg">Yükleniyor...</p>;
    }

    if (error) {
        return <p className="p-8 text-red-500">{error}</p>;
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
            {/* 🔹 HEADER */}
            <header className="bg-white shadow sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/student" className="flex items-center gap-3">
                        <Image
                            src="/images/pusulam_logo.png"
                            alt="Pusulam Logo"
                            width={40}
                            height={40}
                        />
                        <span className="font-bold text-2xl text-[#1087BB]">
                            Pusulam
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 text-sm">
                        <Link href="/student">Sınıflarım</Link>
                        <Link href="/student/info">Profilim</Link>
                        <Link href="/">Çıkış</Link>
                    </nav>
                </div>
            </header>

            {/* 🔹 MAIN */}
            <main className="flex-1 max-w-6xl mx-auto w-full p-8 space-y-8">
                <Link
                    href="/student"
                    className="text-sm text-slate-500 hover:underline"
                >
                    ← Sınıflarıma dön
                </Link>

                {/* 🔹 SINIF BİLGİLERİ */}
                <Card className="shadow-lg rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Sınıf Bilgileri
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 text-lg">
                        <div className="p-4 bg-white/5 rounded-xl shadow-sm">
                            <p className="text-gray-400">Sınıf Adı</p>
                            <p className="font-semibold">{info?.name}</p>
                        </div>

                        <div className="p-4 bg-white/5 rounded-xl shadow-sm">
                            <p className="text-gray-400">Öğretmen</p>
                            <p className="font-semibold">
                                {teacherName ?? "—"}
                            </p>
                        </div>

                        <div className="p-4 bg-white/5 rounded-xl shadow-sm flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            <div>
                                <p className="text-gray-400">Toplam Ödev</p>
                                <p className="font-semibold">
                                    {assignments.length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                    {/* 🔹 İLERLEME */}
                    <div className="md:col-span-3 space-y-2 mt-4 m-6">
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>İlerleme Durumu</span>
                            <span>
                            {completedCount} / {assignments.length} ödev tamamlandı
                            </span>
                        </div>

                        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#1087BB] transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>

                        <p className="text-xs text-slate-500">
                            %{progressPercent} tamamlandı
                        </p>
                    </div>
                </Card>


                {/* 🔹 ÖDEVLER */}
                <Card className="shadow-lg rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <BookOpen className="w-6 h-6" />
                            Verilen Ödevler
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {assignments.length === 0 && (
                            <p className="text-gray-400 text-sm">
                                Bu sınıfa henüz ödev verilmemiş.
                            </p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {assignments.map((assignment) => {
                                const isCompleted =
                                    completedMap[assignment._id];

                                return (
                                    <motion.div
                                        key={assignment._id}
                                        whileHover={{ scale: 1.03 }}
                                        className="p-4 bg-white/5 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between"
                                    >
                                        <div>
                                            <h3 className="font-semibold text-lg text-[#1087BB]">
                                                {assignment.title}
                                            </h3>

                                            {assignment.description && (
                                                <p className="text-sm text-slate-600 mt-2 line-clamp-3">
                                                    {assignment.description}
                                                </p>
                                            )}

                                            {assignment.due_date && (
                                                <p className="text-xs text-slate-500 mt-3">
                                                    Son teslim:{" "}
                                                    {new Date(
                                                        assignment.due_date
                                                    ).toLocaleDateString("tr-TR")}
                                                </p>
                                            )}
                                        </div>

                                        {/* 🔹 BUTTON */}
                                        <div className="mt-4">
                                            {isCompleted ? (
                                                <Link
                                                    href={`/student/assignments/${assignment._id}/result`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        className="w-full"
                                                    >
                                                        Sonuçlarımı Gör
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Link
                                                    href={`/student/assignments/${assignment._id}/solve`}
                                                >
                                                    <Button className="w-full">
                                                        Ödevi Çöz
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </main>

            {/* 🔹 FOOTER */}
            <footer className="bg-white border-t mt-12">
                <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-slate-600">
                        © {new Date().getFullYear()} Pusulam Başarı Takip —
                        Bitirme Projesi
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/privacy" className="text-sm hover:underline">
                            Gizlilik
                        </Link>
                        <Link href="/contact" className="text-sm hover:underline">
                            İletişim
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
