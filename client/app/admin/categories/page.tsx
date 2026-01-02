"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchCategories,
    addCategory,
    deleteCategory,
    updateCategory,
} from "@/redux/admin-categories-store/adminCategoriesThunks";
import { RootState, AppDispatch } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CategoryQuestionPie from "@/app/components/admin/CategoryQuestionPieChart";

export default function AdminCategoriesPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { categories, loading } = useSelector(
        (state: RootState) => state.adminCategories
    );
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");


    const [name, setName] = useState("");

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleAdd = async () => {
        if (!name.trim()) return;
        await dispatch(addCategory({ name }));
        setName("");
        dispatch(fetchCategories());
    };

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold mb-4">
                Kategori – Soru Dağılımı
            </h2>

            <CategoryQuestionPie data={categories} />

            <h1 className="text-2xl font-bold">Kategoriler</h1>

            {/* ➕ Ekle */}
            <div className="flex gap-2 max-w-md">
                <Input
                    placeholder="Yeni kategori adı"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Button onClick={handleAdd}>Ekle</Button>
            </div>

            {/* 📋 Liste */}
            <div className="space-y-3">
                {categories.map((cat) => (
                    <div
                        key={cat._id}
                        className="flex items-center justify-between border p-4 rounded"
                    >
                        {editingId === cat._id ? (
                            <div className="flex gap-2 w-full max-w-md">
                                <Input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                />
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        dispatch(updateCategory({ _id: cat._id, name: editName }));
                                        setEditingId(null);
                                    }}
                                >
                                    Kaydet
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingId(null)}
                                >
                                    İptal
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setEditingId(cat._id);
                                        setEditName(cat.name);
                                    }}
                                >
                                    <p className="font-medium">{cat.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {cat.questionCount} soru
                                    </p>
                                </div>

                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        if (
                                            cat.questionCount > 0 &&
                                            !confirm(`Bu kategoriye bağlı ${cat.questionCount} soru var. Silmek istediğine emin misin?`)
                                        ) {
                                            return;
                                        }
                                        dispatch(deleteCategory(cat._id));
                                    }}
                                >
                                    Sil
                                </Button>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {loading && <p className="text-gray-500">Yükleniyor...</p>}
        </div>
    );
}
