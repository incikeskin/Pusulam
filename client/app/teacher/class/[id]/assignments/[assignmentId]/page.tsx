"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAssignmentFull } from "@/redux/assignment-detail-store/assignmentDetailThunks";

export default function AssignmentDetailPage() {
    const params = useParams();

    // ✅ TS2345 fix → string’e cast
    const assignmentId = params.assignmentId as string;

    const dispatch = useAppDispatch();
    const { assignment, questions, loading, error } = useAppSelector(
        (state) => state.assignmentDetail
    );

    useEffect(() => {
        if (assignmentId) {
            dispatch(fetchAssignmentFull(assignmentId));
        }
    }, [assignmentId, dispatch]);

    if (loading) {
        return <div className="p-6 text-gray-500">Yükleniyor...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    if (!assignment) {
        return <div className="p-6 text-gray-500">Ödev bulunamadı</div>;
    }

    return (
        <div className="p-6 space-y-6">
            {/* =====================
          ÖDEV BİLGİLERİ
      ====================== */}
            <div className="bg-white rounded-xl shadow p-6">
                <h1 className="text-2xl font-semibold">{assignment.title}</h1>
                {assignment.description && (
                    <p className="text-gray-600 mt-2">{assignment.description}</p>
                )}
                {assignment.due_date && (
                    <p className="text-sm text-gray-500 mt-1">
                        Son tarih: {new Date(assignment.due_date).toLocaleDateString()}
                    </p>
                )}
            </div>

            {/* =====================
          SORULAR
      ====================== */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Sorular</h2>

                {questions.length === 0 && (
                    <p className="text-gray-500">Bu ödevde henüz soru yok.</p>
                )}

                {questions.map((q, index) => (
                    <div
                        key={q._id}
                        className="bg-white rounded-xl shadow p-5 space-y-3"
                    >
                        <div className="flex justify-between items-start">
                            <p className="font-medium">
                                {index + 1}. {q.text}
                            </p>

                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {q.category} · {q.difficulty}
              </span>
                        </div>

                        {/* =====================
                ŞIKLAR
            ====================== */}
                        <div className="space-y-2 pl-4">
                            {(q.options ?? []).map((opt: any) => (
                                <div
                                    key={opt._id}
                                    className={`p-2 rounded border ${
                                        opt.is_correct
                                            ? "border-green-500 bg-green-50"
                                            : "border-gray-200"
                                    }`}
                                >
                                    {opt.text}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
