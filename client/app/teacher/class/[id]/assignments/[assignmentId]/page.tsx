"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { BookOpen, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

/* assignment detail */
import {
    fetchAssignmentFull,
    addQuestionToAssignment,
    removeQuestionFromAssignment,
} from "@/redux/assignment-detail-store/assignmentDetailThunks";

/* question pool */
import {
    fetchCategories,
    fetchQuestionsByCategory,
    setSelectedCategory,
    setSelectedDifficulty,
} from "@/redux/question-pool-store";

export default function AssignmentDetailPage() {
    const dispatch = useAppDispatch();
    const params = useParams();
    const assignmentId = params.assignmentId as string;

    const { assignment, questions, loading, error } = useAppSelector(
        (state) => state.assignmentDetail
    );

    const {
        categories,
        questions: poolQuestions,
        selectedCategoryId,
        selectedDifficulty,
    } = useAppSelector((state) => state.questionPool);

    useEffect(() => {
        if (assignmentId) {
            dispatch(fetchAssignmentFull(assignmentId));
            dispatch(fetchCategories());
        }
    }, [assignmentId, dispatch]);

    useEffect(() => {
        if (selectedCategoryId) {
            dispatch(
                fetchQuestionsByCategory({
                    categoryId: selectedCategoryId,
                    difficulty: selectedDifficulty || undefined,
                })
            );
        }
    }, [dispatch, selectedCategoryId, selectedDifficulty]);

    const assignedQuestionIds = questions.map((q) => q.question._id);

    const handleAddQuestion = (questionId: string) => {
        dispatch(addQuestionToAssignment({ assignmentId, questionId }))
            .unwrap()
            .then(() => dispatch(fetchAssignmentFull(assignmentId)));
    };

    const handleRemoveQuestion = (assignmentQuestionId: string) => {
        dispatch(removeQuestionFromAssignment(assignmentQuestionId))
            .unwrap()
            .then(() => dispatch(fetchAssignmentFull(assignmentId)));
    };

    if (loading) return <p className="p-6 text-gray-500">Yükleniyor...</p>;
    if (error) return <p className="p-6 text-red-500">{error}</p>;
    if (!assignment) return null;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">

            {/* --------- HEADER --------- */}
            <header className="bg-white shadow sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src="/images/pusulam_logo.png"
                            alt="Pusulam Logo"
                            width={40}
                            height={40}
                            className="object-contain"
                        />
                        <div className="font-sans font-bold text-2xl text-[#1087BB]">Pusulam</div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 text-sm">
                        <Link href="/" className="hover:text-[#1087BB] transition">Anasayfa</Link>
                        <Link href="/teacher" className="hover:text-[#1087BB] transition">Sınıflarım</Link>
                        <Link href="/teacher" className="hover:text-[#1087BB] transition">Çıkış</Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1 w-full p-6 space-y-6">

                {/* Ödev Bilgileri */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">{assignment.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-gray-600">{assignment.description}</p>
                        <p className="text-sm text-gray-400">Sınıf: {assignment.class?.name}</p>
                    </CardContent>
                </Card>

                {/* Mevcut Sorular */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5" /> Ödev Soruları
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {questions.length === 0 && (
                            <p className="text-gray-500">Bu ödevde henüz soru yok.</p>
                        )}
                        {questions.map((q, index) => (
                            <div key={q._id} className="border rounded-xl p-4 space-y-2 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <p className="font-medium">{index + 1}. {q.question.text}</p>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="flex items-center gap-1"
                                        onClick={() => handleRemoveQuestion(q._id)}
                                    >
                                        <Trash2 className="w-4 h-4" /> Sil
                                    </Button>
                                </div>
                                <div className="pl-4 space-y-1 text-sm">
                                    {q.question.options?.map((opt) => (
                                        <div key={opt._id} className={opt.is_correct ? "text-green-600" : ""}>
                                            • {opt.text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Soru Havuzu */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PlusCircle className="w-5 h-5" /> Soru Ekle
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        {/* Filters */}
                        <div className="flex gap-4 mb-4">
                            <select
                                className="border rounded px-3 py-2"
                                value={selectedCategoryId || ""}
                                onChange={(e) => dispatch(setSelectedCategory(e.target.value || null))}
                            >
                                <option value="">Kategori Seç</option>
                                {categories.map((c) => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>

                            <select
                                className="border rounded px-3 py-2"
                                value={selectedDifficulty || ""}
                                onChange={(e) => dispatch(setSelectedDifficulty(e.target.value as any))}
                            >
                                <option value="">Zorluk</option>
                                <option value="easy">Kolay</option>
                                <option value="medium">Orta</option>
                                <option value="hard">Zor</option>
                            </select>
                        </div>

                        {/* Questions Pool */}
                        <div className="space-y-3">
                            {poolQuestions.map((q) => {
                                const alreadyAdded = assignedQuestionIds.includes(q._id);
                                return (
                                    <div key={q._id} className="flex items-start gap-3 p-3 border rounded-xl shadow-sm">
                                        <Checkbox
                                            checked={alreadyAdded}
                                            disabled={alreadyAdded}
                                            onCheckedChange={() => handleAddQuestion(q._id)}
                                        />
                                        <div>
                                            <p className="font-medium">{q.text}</p>
                                            <p className="text-sm text-gray-500">
                                                {q.category?.name} · {q.difficulty}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </CardContent>
                </Card>

            </main>

            {/* --------- FOOTER --------- */}
            <footer className="bg-white border-t mt-12">
                <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-slate-600">
                        © {new Date().getFullYear()} Pusulam Başarı Takip — Bitirme Projesi
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                        <Link href="/privacy" className="text-sm text-slate-600 hover:underline transition">Gizlilik</Link>
                        <Link href="/contact" className="text-sm text-slate-600 hover:underline transition">İletişim</Link>
                        <a href="https://github.com/" target="_blank" rel="noreferrer" className="text-sm text-slate-600 hover:underline transition">GitHub</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
