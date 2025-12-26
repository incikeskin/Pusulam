"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    fetchStudentResult,
    fetchStudentAnswers,
} from "@/redux/assignment-result-store/assignmentResultThunks";

export default function StudentAssignmentResultPage() {
    const params = useParams();

    // ✅ DOĞRU PARAM
    const assignmentId = params?.assignmentId as string;

    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const {
        studentResult,
        studentAnswers,
        loading,
        error,
    } = useAppSelector((state) => state.assignmentResult);

    const studentId = user?._id;

    /* ---------------- FETCH DATA ---------------- */
    useEffect(() => {
        if (!assignmentId || !studentId) return;

        dispatch(fetchStudentResult({ assignmentId, studentId }));
        dispatch(fetchStudentAnswers({ assignmentId, studentId }));
    }, [assignmentId, studentId, dispatch]);

    /* ---------------- USER YOK ---------------- */
    if (!studentId) {
        return (
            <p className="p-10 text-center text-red-500">
                Öğrenci bilgisi bulunamadı. Lütfen tekrar giriş yapın.
            </p>
        );
    }

    /* ---------------- LOADING ---------------- */
    if (loading) {
        return (
            <p className="p-10 text-center text-lg text-slate-500">
                Sonuçlar yükleniyor...
            </p>
        );
    }

    /* ---------------- ERROR ---------------- */
    if (error) {
        return (
            <p className="p-10 text-center text-red-500 font-medium">
                {error}
            </p>
        );
    }

    /* ---------------- BOŞ DURUM ---------------- */
    if (!studentResult && studentAnswers.length === 0) {
        return (
            <p className="p-10 text-center text-slate-500">
                Sonuç bulunamadı.
            </p>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <main className="max-w-5xl mx-auto p-8 space-y-8">
                {/* 🔙 GERİ */}
                <Link
                    href="/student"
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Geri dön
                </Link>

                {/* 📊 GENEL SONUÇ */}
                {studentResult && (
                    <Card className="rounded-2xl shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">
                                Ödev Sonucu
                            </CardTitle>
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
                                <p className="text-3xl font-bold">
                                    %{studentResult.score_percent}
                                </p>
                                <p className="text-sm">Başarı</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* 🧠 SORU DETAYLARI */}
                <Card className="rounded-2xl shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Soru Detayları
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {studentAnswers.length > 0 ? (
                            studentAnswers.map((answer, index) => (
                                <div
                                    key={answer._id}
                                    className="flex gap-4 p-4 border rounded-xl"
                                >
                                    {answer.is_correct ? (
                                        <CheckCircle className="text-green-600 mt-1" />
                                    ) : (
                                        <XCircle className="text-red-600 mt-1" />
                                    )}

                                    <div className="space-y-1">
                                        <p className="font-medium">
                                            {index + 1}. {answer.question?.text}
                                        </p>

                                        <p className="text-sm text-slate-600">
                                            Seçilen cevap:{" "}
                                            <span
                                                className={
                                                    answer.is_correct
                                                        ? "text-green-600 font-semibold"
                                                        : "text-red-600 font-semibold"
                                                }
                                            >
                        {answer.selected_option?.text}
                      </span>
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500">
                                Bu ödev için cevap bulunamadı.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* 🔘 ALT BUTON */}
                <div className="flex justify-end">
                    <Link href="/student">
                        <Button variant="outline">Sınıflara Dön</Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}
