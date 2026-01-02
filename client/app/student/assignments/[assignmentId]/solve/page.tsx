"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

import { fetchAssignmentFull } from "@/redux/assignment-detail-store/assignmentDetailThunks";
import {
    fetchStudentAnswers,
    addStudentAnswer,
} from "@/redux/assignment-result-store/assignmentResultThunks";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SolveAssignmentPage = () => {
    const { assignmentId } = useParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const { assignment, questions } = useSelector(
        (state: RootState) => state.assignmentDetail
    );

    const { studentAnswers } = useSelector(
        (state: RootState) => state.assignmentResult
    );

    const { user } = useSelector((state: RootState) => state.auth);
    const studentId = user?._id;

    /* ---------------- FETCH DATA ---------------- */
    useEffect(() => {
        if (!assignmentId || !studentId) return;

        dispatch(fetchAssignmentFull(assignmentId as string));
        dispatch(
            fetchStudentAnswers({
                assignmentId: assignmentId as string,
                studentId,
            })
        );
    }, [assignmentId, studentId, dispatch]);

    /* ---------------- HELPERS ---------------- */
    const getSelectedOptionId = (questionId: string) => {
        return studentAnswers.find(
            (a) => a.question._id === questionId
        )?.selected_option?._id;
    };

    const handleSelectOption = (questionId: string, optionId: string) => {
        if (!studentId) return;

        dispatch(
            addStudentAnswer({
                studentId,
                assignmentId: assignmentId as string,
                questionId,
                selectedOptionId: optionId,
            })
        ).then(() => {
            dispatch(
                fetchStudentAnswers({
                    assignmentId: assignmentId as string,
                    studentId,
                })
            );
        });
    };
    const totalQuestions = questions.length;
    const solvedCount = studentAnswers.length;

    const progressPercent =
        totalQuestions === 0
            ? 0
            : Math.round((solvedCount / totalQuestions) * 100);

    if (!assignment) return null;

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
                </div>
            </header>

            {/* 🔹 MAIN */}
            <main className="flex-1 max-w-6xl mx-auto w-full p-8 space-y-8">
                <Link
                    href="/student"
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" /> Geri dön
                </Link>

                {/* 🔹 ASSIGNMENT INFO */}
                <Card className="rounded-2xl shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            {assignment.title}
                        </CardTitle>
                    </CardHeader>
                    {assignment.description && (
                        <CardContent className="text-slate-600">
                            {assignment.description}
                        </CardContent>
                    )}
                </Card>

                {/* 🔹 PROGRESS */}
                <Card className="rounded-2xl shadow-lg">
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>İlerleme Durumu</span>
                            <span>
        {solvedCount} / {totalQuestions} soru çözüldü
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
                    </CardContent>
                </Card>

                {/* 🔹 QUESTIONS */}
                {questions.map((q, index) => {
                    const selectedOptionId = getSelectedOptionId(q.question._id);

                    return (
                        <Card key={q._id} className="rounded-2xl shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">
                                    {index + 1}. {q.question.text}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {q.question.options?.map((option) => (
                                    <label
                                        key={option._id}
                                        className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition
                      ${
                                            selectedOptionId === option._id
                                                ? "border-[#1087BB] bg-[#1087BB]/10"
                                                : "hover:bg-slate-100"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name={q.question._id}
                                            checked={selectedOptionId === option._id}
                                            onChange={() =>
                                                handleSelectOption(
                                                    q.question._id,
                                                    option._id
                                                )
                                            }
                                        />
                                        <span className="text-slate-800">
                      {option.text}
                    </span>
                                    </label>
                                ))}
                            </CardContent>
                        </Card>
                    );
                })}

                {/* 🔹 ACTION */}
                <div className="flex justify-end">
                    <Button
                        size="lg"
                        onClick={() =>
                            router.push(
                                `/student/assignments/${assignmentId}/result`
                            )
                        }
                    >
                        Ödevi Bitir ve Sonuçları Gör
                    </Button>
                </div>
            </main>

            {/* 🔹 FOOTER */}
            <footer className="bg-white border-t mt-12">
                <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-slate-600 text-center">
                    © {new Date().getFullYear()} Pusulam Başarı Takip — Bitirme Projesi
                </div>
            </footer>
        </div>
    );
};

export default SolveAssignmentPage;
