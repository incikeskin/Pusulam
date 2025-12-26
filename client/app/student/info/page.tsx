"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "@/app/components/LogoutButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateUserProfile } from "@/redux/auth-store/authThunks";

export default function StudentInfoPage() {
    const dispatch = useAppDispatch();

    const { user, loading, error } = useAppSelector((state) => state.auth);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);

    // 🔹 User bilgileri geldiğinde formu doldur
    useEffect(() => {
        if (user) {
            setFirstName(user.first_name || "");
            setLastName(user.last_name || "");
            setPhoneNumber(user.phone_number || "");
        }
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?._id) return;

        // 🔐 Şifre kontrolü
        if (newPassword || confirmPassword) {
            if (newPassword !== confirmPassword) {
                setPasswordError("Şifreler eşleşmiyor");
                return;
            }
            if (newPassword.length < 6) {
                setPasswordError("Şifre en az 6 karakter olmalı");
                return;
            }
        }

        setPasswordError(null);

        dispatch(
            updateUserProfile({
                _id: user._id,
                first_name: firstName,
                last_name: lastName,
                phone_number: phoneNumber,
                ...(newPassword ? { password: newPassword } : {}),
            })
        );

        // Şifre alanlarını temizle
        setNewPassword("");
        setConfirmPassword("");
    };

    return (
        <div className="min-h-screen flex bg-slate-50 text-slate-900 antialiased">
            {/* Sol Panel */}
            <div className="w-1/4 bg-[#1087BB] text-white flex flex-col p-6">
                <div className="flex flex-col items-center mb-10">
                    <Image
                        src="/images/pusulam_logo.png"
                        alt="Öğrenci Logo"
                        width={80}
                        height={80}
                        className="rounded-full object-contain mb-2"
                    />
                    <h2 className="text-xl font-bold">
                        {user ? `${user.first_name} ${user.last_name}` : "Öğrenci"}
                    </h2>
                    <p className="text-sm">Öğrenci</p>
                </div>

                <nav className="flex flex-col gap-4 mt-6">
                    <Link
                        href="/student"
                        className="hover:bg-[#0d75a0] px-4 py-2 rounded transition"
                    >
                        Sınıflarım
                    </Link>
                    <LogoutButton />
                </nav>
            </div>

            {/* Sağ Panel */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow sticky top-0 z-50">
                    <div className="max-w-4xl mx-auto px-6 py-4">
                        <h1 className="text-2xl font-bold text-[#1087BB]">
                            Profil Bilgilerim
                        </h1>
                    </div>
                </header>

                <main className="flex-1 p-6">
                    <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Ad */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Ad</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1087BB]"
                                />
                            </div>

                            {/* Soyad */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Soyad</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1087BB]"
                                />
                            </div>

                            {/* Email (readonly) */}
                            <div>
                                <label className="block text-sm font-medium mb-1">E-posta</label>
                                <input
                                    type="email"
                                    value={user?.email || ""}
                                    disabled
                                    className="w-full border rounded px-3 py-2 bg-slate-100 cursor-not-allowed"
                                />
                            </div>

                            {/* Telefon */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Telefon Numarası
                                </label>
                                <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1087BB]"
                                />
                            </div>

                            {/* 🔐 Şifre Güncelleme */}
                            <div className="pt-6 border-t">
                                <h3 className="text-lg font-semibold text-[#1087BB] mb-4">
                                    Şifre Güncelle
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Yeni Şifre
                                        </label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1087BB]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Yeni Şifre (Tekrar)
                                        </label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1087BB]"
                                        />
                                    </div>

                                    {passwordError && (
                                        <p className="text-red-500 text-sm">{passwordError}</p>
                                    )}
                                </div>
                            </div>

                            {/* Backend / Auth error */}
                            {error && (
                                <p className="text-red-500 text-sm pt-2">{error}</p>
                            )}

                            {/* Kaydet */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-[#1087BB] text-white px-6 py-2 rounded hover:bg-[#0d75a0] transition disabled:opacity-50"
                                >
                                    {loading ? "Kaydediliyor..." : "Bilgileri Güncelle"}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
