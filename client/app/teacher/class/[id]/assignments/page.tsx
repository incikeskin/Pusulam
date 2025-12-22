"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PlusCircle, BookOpen, FileText } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

/* -------- assignment-create -------- */
import {
    createAssignment,
    setFormField,
    addSelectedQuestion,
    removeSelectedQuestion,
    addNewQuestion,
    removeNewQuestion,
} from "@/redux/assignment-create-store";

/* -------- question-pool -------- */
import {
    fetchCategories,
    fetchQuestionsByCategory,
    setSelectedCategory,
    setSelectedDifficulty,
} from "@/redux/question-pool-store";

export default function CreateAssignmentPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const params = useParams();
    const classId = params.id as string;
    const teacherId = useAppSelector((state) => state.auth.user?._id);

    const { form, selectedQuestionIds, newQuestions, loading } =
        useAppSelector((state) => state.assignmentCreate);

    const { categories, questions, selectedCategoryId, selectedDifficulty } =
        useAppSelector((state) => state.questionPool);

    const [questionText, setQuestionText] = useState("");
    const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [options, setOptions] = useState(
        Array(4).fill({ text: "", is_correct: false })
    );

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

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

    const handleAddDraftQuestion = () => {
        if (!questionText.trim() || !categoryId) return;

        dispatch(
            addNewQuestion({
                text: questionText,
                difficulty,
                category: categoryId,
                options,
            })
        );

        setQuestionText("");
        setDifficulty("medium");
        setCategoryId(null);
        setOptions(Array(4).fill({ text: "", is_correct: false }));
    };

    const handleSubmit = () => {
        if (!classId || !teacherId) return;

        dispatch(createAssignment({ classId, teacherId }))
            .unwrap()
            .then(() => router.push(`/teacher/class/${classId}`));
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
            {/* Header */}
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

            {/* Main Content */}
            <main className="flex-1 p-8 max-w-5xl mx-auto space-y-8">
                {/* Başlık */}
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <PlusCircle className="w-7 h-7" />
                        Yeni Ödev Oluştur
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Bu sayfadan sınıfınıza yeni bir ödev tanımlayabilirsiniz.
                    </p>
                </div>

                {/* Ödev Bilgileri */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" /> Ödev Bilgileri
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            placeholder="Ödev Başlığı"
                            value={form.title}
                            onChange={(e) =>
                                dispatch(setFormField({ field: "title", value: e.target.value }))
                            }
                        />
                        <Textarea
                            placeholder="Ödev Açıklaması"
                            rows={4}
                            value={form.description}
                            onChange={(e) =>
                                dispatch(
                                    setFormField({ field: "description", value: e.target.value })
                                )
                            }
                        />
                        <Input
                            type="date"
                            value={form.due_date}
                            onChange={(e) =>
                                dispatch(setFormField({ field: "due_date", value: e.target.value }))
                            }
                        />
                    </CardContent>
                </Card>

                {/* Soru Havuzu */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5" /> Soru Havuzu
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-4">
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

                        <div className="space-y-3">
                            {questions.map((q) => (
                                <div key={q._id} className="flex items-start gap-3 p-3 border rounded-xl">
                                    <Checkbox
                                        checked={selectedQuestionIds.includes(q._id)}
                                        onCheckedChange={(checked) =>
                                            checked
                                                ? dispatch(addSelectedQuestion(q._id))
                                                : dispatch(removeSelectedQuestion(q._id))
                                        }
                                    />
                                    <div>
                                        <p className="font-medium">{q.text}</p>
                                        <p className="text-sm text-gray-500">
                                            {q.category?.name} · {q.difficulty}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Yeni Soru */}
                <Card>
                    <CardHeader>
                        <CardTitle>Yeni Soru Ekle</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Soru metni"
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                        />

                        <select
                            className="border rounded px-3 py-2"
                            value={categoryId || ""}
                            onChange={(e) => setCategoryId(e.target.value || null)}
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
                            value={difficulty}
                            onChange={(e) =>
                                setDifficulty(e.target.value as "easy" | "medium" | "hard")
                            }
                        >
                            <option value="easy">Kolay</option>
                            <option value="medium">Orta</option>
                            <option value="hard">Zor</option>
                        </select>

                        {options.map((opt, i) => (
                            <div key={i} className="flex gap-2 items-center">
                                <input
                                    type="radio"
                                    checked={opt.is_correct}
                                    onChange={() =>
                                        setOptions((prev) =>
                                            prev.map((o, idx) => ({ ...o, is_correct: idx === i }))
                                        )
                                    }
                                />
                                <Input
                                    placeholder={`Şık ${String.fromCharCode(65 + i)}`}
                                    value={opt.text}
                                    onChange={(e) =>
                                        setOptions((prev) =>
                                            prev.map((o, idx) =>
                                                idx === i ? { ...o, text: e.target.value } : o
                                            )
                                        )
                                    }
                                />
                            </div>
                        ))}

                        <Button variant="outline" onClick={handleAddDraftQuestion}>
                            Soruyu Taslağa Ekle
                        </Button>
                    </CardContent>
                </Card>

                {/* Taslak Sorular */}
                {newQuestions.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>📝 Taslak Sorular</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {newQuestions.map((q, index) => (
                                <div key={index} className="p-4 border rounded-xl space-y-2">
                                    <div className="flex justify-between">
                                        <p className="font-medium">{q.text}</p>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => dispatch(removeNewQuestion(index))}
                                        >
                                            Sil
                                        </Button>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        Kategori: {categories.find(c => c._id === q.category)?.name} · Zorluk: {q.difficulty}
                                    </p>
                                    <ul className="pl-4 text-sm space-y-1">
                                        {q.options?.map((o, i) => (
                                            <li key={i}>
                                                {o.is_correct ? "✅" : "⬜"} {o.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Submit */}
                <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={() => router.back()}>
                        İptal
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Oluşturuluyor..." : "Ödevi Oluştur"}
                    </Button>
                </div>
            </main>

            {/* Footer */}
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
