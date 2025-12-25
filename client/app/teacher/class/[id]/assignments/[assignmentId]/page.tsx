"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BookOpen, PlusCircle, Trash2, User } from "lucide-react";
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

/* assignment results */
import {
    fetchStudentResult,
    fetchStudentAnswers,
} from "@/redux/assignment-result-store/assignmentResultThunks";

/* class detail (students) */
import { fetchClassStudents } from "@/redux/classDetail-store/classDetailThunks";

export default function AssignmentDetailPage() {
    const dispatch = useAppDispatch();
    const params = useParams();
    const assignmentId = params.assignmentId as string;

    const [selectedStudentId, setSelectedStudentId] = useState<string>("");

    const { assignment, questions, loading, error } = useAppSelector(
        (state) => state.assignmentDetail
    );

    const {
        categories,
        questions: poolQuestions,
        selectedCategoryId,
        selectedDifficulty,
    } = useAppSelector((state) => state.questionPool);

    const { students } = useAppSelector((state) => state.classDetail);

    const {
        studentResult,
        studentAnswers,
        loading: resultLoading,
    } = useAppSelector((state) => state.assignmentResult);

    /* ---------------- EFFECTS ---------------- */

    useEffect(() => {
        if (assignmentId) {
            dispatch(fetchAssignmentFull(assignmentId));
            dispatch(fetchCategories());
        }
    }, [assignmentId, dispatch]);

    useEffect(() => {
        if (assignment?.class?._id) {
            dispatch(fetchClassStudents(assignment.class._id));
        }
    }, [assignment, dispatch]);

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

    useEffect(() => {
        if (assignmentId && selectedStudentId) {
            dispatch(fetchStudentResult({ assignmentId, studentId: selectedStudentId }));
            dispatch(fetchStudentAnswers({ assignmentId, studentId: selectedStudentId }));
        }
    }, [assignmentId, selectedStudentId, dispatch]);

    /* ---------------- HELPERS ---------------- */

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

    /* ---------------- STATES ---------------- */

    if (loading) return <p className="p-6 text-gray-500">Yükleniyor...</p>;
    if (error) return <p className="p-6 text-red-500">{error}</p>;
    if (!assignment) return null;

    /* ---------------- UI ---------------- */

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">

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

                {/* ASSIGNMENT INFO */}
                <Card>
                    <CardHeader>
                        <CardTitle>{assignment.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{assignment.description}</p>
                        <p className="text-sm text-gray-400">Sınıf: {assignment.class?.name}</p>
                    </CardContent>
                </Card>

                {/* STUDENT SELECT */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex gap-2">
                            <User className="w-5 h-5" /> Öğrenci Seç
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <select
                            className="border px-3 py-2 rounded w-full"
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(e.target.value)}
                        >
                            <option value="">Öğrenci seçiniz</option>
                            {students.map((s) => (
                                <option key={s.student._id} value={s.student._id}>
                                    {s.student.first_name} {s.student.last_name}
                                </option>
                            ))}
                        </select>
                    </CardContent>
                </Card>

                {/* STUDENT RESULT */}
                {selectedStudentId && (
                    <Card>
                        <CardHeader>
                            <CardTitle>📊 Öğrenci Sonucu</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {resultLoading && <p>Yükleniyor...</p>}
                            {studentResult && (
                                <ul className="space-y-1 text-sm">
                                    <li>Toplam: {studentResult.total}</li>
                                    <li className="text-green-600">Doğru: {studentResult.correct}</li>
                                    <li className="text-red-600">Yanlış: {studentResult.incorrect}</li>
                                    <li className="font-semibold">%{studentResult.score_percent}</li>
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* STUDENT ANSWERS */}
                {selectedStudentId && (
                    <Card>
                        <CardHeader>
                            <CardTitle>📝 Öğrenci Cevapları</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {studentAnswers.map((a, i) => (
                                <div key={a._id} className="border p-4 rounded">
                                    <p className="font-medium">{i + 1}. {a.question.text}</p>
                                    <p
                                        className={
                                            a.is_correct ? "text-green-600" : "text-red-600"
                                        }
                                    >
                                        Seçilen: {a.selected_option.text}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* ASSIGNMENT QUESTIONS */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex gap-2">
                            <BookOpen className="w-5 h-5" /> Ödev Soruları
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {questions.map((q, i) => (
                            <div key={q._id} className="border p-4 rounded flex justify-between">
                                <p>{i + 1}. {q.question.text}</p>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleRemoveQuestion(q._id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* QUESTION POOL */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex gap-2">
                            <PlusCircle className="w-5 h-5" /> Soru Ekle
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">

                        {/* FILTERS — ESKİ ÇALIŞAN HAL */}
                        <div className="flex gap-4 mb-4">
                            <select
                                className="border rounded px-3 py-2"
                                value={selectedCategoryId || ""}
                                onChange={(e) =>
                                    dispatch(setSelectedCategory(e.target.value || null))
                                }
                            >
                                <option value="">Kategori Seç</option>
                                {categories.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="border rounded px-3 py-2"
                                value={selectedDifficulty || ""}
                                onChange={(e) =>
                                    dispatch(setSelectedDifficulty(e.target.value as any))
                                }
                            >
                                <option value="">Zorluk</option>
                                <option value="easy">Kolay</option>
                                <option value="medium">Orta</option>
                                <option value="hard">Zor</option>
                            </select>
                        </div>

                        {/* QUESTIONS POOL — ESKİ DOĞRU LOGIC */}
                        <div className="space-y-3">
                            {poolQuestions.map((q) => {
                                const alreadyAdded = assignedQuestionIds.includes(q._id);

                                return (
                                    <div
                                        key={q._id}
                                        className="flex gap-3 border p-3 rounded"
                                    >
                                        <Checkbox
                                            checked={alreadyAdded}
                                            disabled={alreadyAdded}
                                            onCheckedChange={() =>
                                                handleAddQuestion(q._id)
                                            }
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

            {/* FOOTER */}
            <footer className="bg-white border-t">
                <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-gray-500 flex justify-between">
                    <span>© {new Date().getFullYear()} Pusulam</span>
                    <span>Bitirme Projesi</span>
                </div>
            </footer>
        </div>
    );
}
