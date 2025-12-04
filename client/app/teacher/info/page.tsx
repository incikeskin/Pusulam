"use client";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateUserProfile } from "@/redux/auth-store/authThunks";
import Image from "next/image";
import Link from "next/link";

export default function TeacherInfoPage() {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || "");

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setPhoneNumber(user.phone_number || "");
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!user?._id) return;

    try {
      await dispatch(
        updateUserProfile({
          _id: user._id,
          first_name: firstName,
          last_name: lastName,
          password: password || undefined,
          phone_number: phoneNumber,
        })
      ).unwrap();

      setPassword(""); // şifreyi temizle
      alert("Bilgiler başarıyla güncellendi!");
    } catch (err) {
      alert(typeof err === "string" ? err : "Güncelleme başarısız");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 antialiased">
      {/* Sol panel */}
      <div className="w-1/4 bg-[#1087BB] text-white flex flex-col p-6">
        <div className="flex flex-col items-center mb-10">
          <Image
            src="/images/pusulam_logo.png"
            alt="Öğretmen Logo"
            width={80}
            height={80}
            className="rounded-full object-contain mb-2"
          />
          <h2 className="text-xl font-bold">
            {user ? `${user.first_name} ${user.last_name}` : "Öğretmen"}
          </h2>
          <p className="text-sm">{user?.role === "teacher" ? "Öğretmen" : ""}</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4 mt-6">
          <div className="px-4 py-2 rounded text-left cursor-default">
            Profil Bilgilerim
          </div>
          <Link
            href="/teacher"
            className="hover:bg-[#0d75a0] px-4 py-2 rounded text-left transition inline-block"
          >
            Geri
          </Link>
        </nav>
      </div>

      {/* Sağ panel */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/images/pusulam_logo.png"
                alt="Pusulam Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <div className="font-sans font-bold text-2xl text-[#1087BB]">
                Pusulam
              </div>
            </div>
          </div>
        </header>

        {/* İçerik */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-4 p-6 bg-white rounded-xl shadow">
            <h1 className="text-2xl font-bold text-[#1087BB]">Kişisel Bilgiler</h1>

            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ad"
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Soyad"
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Telefon"
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Yeni Şifre"
              className="w-full border px-3 py-2 rounded"
            />

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Güncelleniyor..." : "Güncelle"}
            </button>

            {error && <p className="text-red-500">{error}</p>}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600">
              © {new Date().getFullYear()} Pusulam Başarı Takip — Bitirme Projesi
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

