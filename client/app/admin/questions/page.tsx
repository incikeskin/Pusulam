"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchQuestions,
    deleteQuestion,
    updateQuestion,
} from "@/redux/admin-question-store/adminQuestionThunks";

import {
    fetchOptionsByQuestion,
    updateOption,
    deleteOption,
    createOption,
} from "@/redux/admin-options-store/adminOptionsThunks";

import { fetchCategories } from "@/redux/admin-categories-store/adminCategoriesThunks";

import { RootState, AppDispatch } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { QuestionItem } from "@/redux/types";

export default function AdminQuestionsPage() {
    const dispatch = useDispatch<AppDispatch>();

    /* ------------------ CATEGORIES ------------------ */
    const { categories } = useSelector(
        (state: RootState) => state.adminCategories
    );
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

    /* ------------------ QUESTIONS ------------------ */
    const { questions, loading } = useSelector(
        (state: RootState) => state.adminQuestions
    );

    const [search, setSearch] = useState("");
    const [selectedQuestion, setSelectedQuestion] =
        useState<QuestionItem | null>(null);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        dispatch(fetchQuestions());
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (selectedQuestion) {
            setEditText(selectedQuestion.text);
        }
    }, [selectedQuestion]);

    const filteredQuestions = questions.filter((q) => {
        const matchText = q.text
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchCategory =
            !selectedCategoryId ||
            (typeof q.category === "object"
                ? q.category._id === selectedCategoryId
                : q.category === selectedCategoryId);

        return matchText && matchCategory;
    });

    /* ------------------ OPTIONS ------------------ */
    const { options, loading: optionsLoading } = useSelector(
        (state: RootState) => state.adminOptions
    );

    const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
    const [optionText, setOptionText] = useState("");
    const [newOptionText, setNewOptionText] = useState("");
    const [newOptionCorrect, setNewOptionCorrect] = useState(false);

    useEffect(() => {
        if (selectedQuestion) {
            dispatch(fetchOptionsByQuestion(selectedQuestion._id));
        }
    }, [selectedQuestion, dispatch]);

    /* ------------------ RENDER ------------------ */
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Sorular</h1>
            <p className="text-gray-600">
                Kategoriye göre filtreleyip soruyu seçerek düzenleyebilirsiniz.
            </p>

            {/* 🔎 Filtreler */}
            <div className="flex gap-4 max-w-xl">
                <Input
                    placeholder="Soru ara..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="border rounded px-3 py-2 text-sm"
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                    <option value="">Tüm Kategoriler</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* 📋 Soru Listesi */}
            <div className="space-y-3">
                {filteredQuestions.map((q) => (
                    <div
                        key={q._id}
                        onClick={() => setSelectedQuestion(q)}
                        className="border p-4 rounded cursor-pointer hover:bg-gray-50 flex justify-between"
                    >
                        <div>
                            <p className="font-medium">{q.text}</p>
                            <p className="text-sm text-gray-500">
                                Kategori:{" "}
                                {typeof q.category === "object"
                                    ? q.category.name
                                    : q.category}
                                {" | "}Zorluk: {q.difficulty}
                            </p>
                        </div>

                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                dispatch(deleteQuestion(q._id));
                            }}
                        >
                            Sil
                        </Button>
                    </div>
                ))}
            </div>

            {loading && <p className="text-gray-500">Yükleniyor...</p>}

            {/* ✏️ Soru Düzenleme */}
            {selectedQuestion && (
                <div className="border rounded p-4 bg-gray-50 space-y-3">
                    <h2 className="font-semibold">Seçili Soru</h2>

                    <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                    />

                    <Button
                        onClick={() =>
                            dispatch(
                                updateQuestion({
                                    _id: selectedQuestion._id,
                                    text: editText,
                                })
                            )
                        }
                    >
                        Kaydet
                    </Button>
                </div>
            )}

            {/* 🟢 Şıklar */}
            {selectedQuestion && (
                <div className="border rounded p-4 bg-gray-50 space-y-4">
                    <h2 className="font-semibold">Şıklar</h2>

                    {optionsLoading && <p>Şıklar yükleniyor...</p>}

                    {!optionsLoading && options.length === 0 && (
                        <p className="text-sm text-gray-500">
                            Bu soruya ait şık bulunamadı.
                        </p>
                    )}

                    {options.map((opt) => (
                        <div key={opt._id} className="flex gap-2 items-center">
                            {editingOptionId === opt._id ? (
                                <>
                                    <Input
                                        value={optionText}
                                        onChange={(e) => setOptionText(e.target.value)}
                                    />
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            dispatch(
                                                updateOption({
                                                    _id: opt._id,
                                                    text: optionText,
                                                    is_correct: opt.is_correct,
                                                })
                                            );
                                            setEditingOptionId(null);
                                        }}
                                    >
                                        Kaydet
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <span
                                        className={`flex-1 cursor-pointer ${
                                            opt.is_correct
                                                ? "font-semibold text-green-600"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            setEditingOptionId(opt._id);
                                            setOptionText(opt.text);
                                        }}
                                    >
                                        {opt.text}
                                    </span>

                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                            dispatch(deleteOption(opt._id))
                                        }
                                    >
                                        Sil
                                    </Button>
                                </>
                            )}
                        </div>
                    ))}

                    {/* ➕ Yeni Şık */}
                    <div className="border-t pt-4 space-y-2">
                        <h3 className="font-medium">Yeni Şık Ekle</h3>

                        <Input
                            placeholder="Şık metni"
                            value={newOptionText}
                            onChange={(e) =>
                                setNewOptionText(e.target.value)
                            }
                        />

                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={newOptionCorrect}
                                onChange={(e) =>
                                    setNewOptionCorrect(e.target.checked)
                                }
                            />
                            Doğru şık
                        </label>

                        <Button
                            onClick={() => {
                                if (!newOptionText.trim() || !selectedQuestion)
                                    return;

                                dispatch(
                                    createOption({
                                        question: selectedQuestion._id,
                                        text: newOptionText,
                                        is_correct: newOptionCorrect,
                                    })
                                );

                                setNewOptionText("");
                                setNewOptionCorrect(false);
                            }}
                        >
                            Şık Ekle
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
