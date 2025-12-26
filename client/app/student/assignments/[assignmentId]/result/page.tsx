"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchStudentResult, fetchStudentAnswers } from "@/redux/assignment-result-store/assignmentResultThunks";
import { fetchAssignmentFull } from "@/redux/assignment-detail-store/assignmentDetailThunks";
import axiosInstance from "@/utils/axiosInstance";

export default function StudentAssignmentResultPage() {
    const params = useParams();
    const assignmentId = params?.assignmentId as string;

    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const { studentResult, studentAnswers, loading, error } = useAppSelector((state) => state.assignmentResult);
    const { assignment } = useAppSelector((state) => state.assignmentDetail);

    const studentId = user?._id;

    const [classRanking, setClassRanking] = useState<{
        studentScore: number;
        classAverage: number;
        rank: number;
        totalStudents: number;
    } | null>(null);

    /* ---------------- FETCH DATA ---------------- */
    useEffect(() => {
        if (!assignmentId || !studentId) return;

        dispatch(fetchStudentResult({ assignmentId, studentId }));
        dispatch(fetchStudentAnswers({ assignmentId, studentId }));
        dispatch(fetchAssignmentFull(assignmentId));
    }, [assignmentId, studentId, dispatch]);

    /* ---------------- FETCH CLASS RANKING ---------------- */
    useEffect(() => {
        const fetchRanking = async () => {
            if (!assignment?.class?._id || !assignmentId || !studentId) return;
            try {
                const res = await axiosInstance.get(
                    `/api/studentAnswers/class-ranking/${assignmentId}/${assignment.class._id}/${studentId}`
                );
                setClassRanking(res.data.data);
            } catch (err) {
                console.error("Ranking fetch error:", err);
            }
        };
        fetchRanking();
    }, [assignment, assignmentId, studentId]);

    /* ---------------- LOADING / ERROR / NO DATA ---------------- */
    if (!studentId) return <p className="p-10 text-center text-red-500">Öğrenci bilgisi bulunamadı.</p>;
    if (loading) return <p className="p-10 text-center text-lg text-slate-500">Sonuçlar yükleniyor...</p>;
    if (error) return <p className="p-10 text-center text-red-500 font-medium">{error}</p>;
    if (!studentResult && studentAnswers.length === 0) return <p className="p-10 text-center text-slate-500">Sonuç bulunamadı.</p>;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
            {/* 🔹 HEADER */}
            <header className="bg-white shadow sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/student" className="flex items-center gap-3">
                        <Image src="/images/pusulam_logo.png" alt="Pusulam Logo" width={40} height={40} />
                        <span className="font-bold text-2xl text-[#1087BB]">Pusulam</span>
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
                <Link href="/student" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Geri dön
                </Link>

                {/* 🔹 ÖDEV SONUCU */}
                {studentResult && (
                    <Card className="rounded-2xl shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Ödev Sonucu</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            <div>
                                <p className="text-3xl font-bold">{studentResult.total}</p>
                                <p className="text-sm text-slate-500">Toplam Soru</p>
                            </div>
                            <div className="text-green-600">
                                <p className="text-3xl font-bold">{studentResult.correct}</p>
                                <p className="text-sm">Doğru</p>
                            </div>
                            <div className="text-red-600">
                                <p className="text-3xl font-bold">{studentResult.incorrect}</p>
                                <p className="text-sm">Yanlış</p>
                            </div>
                            <div className="text-[#1087BB]">
                                <p className="text-3xl font-bold">%{studentResult.score_percent}</p>
                                <p className="text-sm">Başarı</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* 🔹 SINIF SIRALAMASI */}
                {classRanking && (
                    <Card className="rounded-2xl shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Sınıf Sıralaması</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                            <div>
                                <p className="text-3xl font-bold">{classRanking.studentScore}</p>
                                <p className="text-sm text-slate-500">Senin Skorun</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{classRanking.classAverage}</p>
                                <p className="text-sm text-slate-500">Sınıf Ortalaması</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{classRanking.rank}</p>
                                <p className="text-sm text-slate-500">Sıralaman</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{classRanking.totalStudents}</p>
                                <p className="text-sm text-slate-500">Toplam Öğrenci</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* 🔹 SORU DETAYLARI */}
                <Card className="rounded-2xl shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Soru Detayları</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {studentAnswers.length > 0 ? (
                            studentAnswers.map((answer, index) => (
                                <div key={answer._id} className="flex gap-4 p-4 border rounded-xl">
                                    {answer.is_correct ? (
                                        <CheckCircle className="text-green-600 mt-1" />
                                    ) : (
                                        <XCircle className="text-red-600 mt-1" />
                                    )}
                                    <div className="space-y-1">
                                        <p className="font-medium">{index + 1}. {answer.question?.text}</p>
                                        <p className="text-sm text-slate-600">
                                            Seçilen cevap:{" "}
                                            <span className={answer.is_correct ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                                                {answer.selected_option?.text}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500">Bu ödev için cevap bulunamadı.</p>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Link href="/student">
                        <Button variant="outline">Sınıflara Dön</Button>
                    </Link>
                </div>
            </main>

            {/* 🔹 FOOTER */}
            <footer className="bg-white border-t mt-12">
                <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-slate-600">
                        © {new Date().getFullYear()} Pusulam Başarı Takip — Bitirme Projesi
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/privacy" className="text-sm hover:underline">Gizlilik</Link>
                        <Link href="/contact" className="text-sm hover:underline">İletişim</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
