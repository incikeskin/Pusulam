"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getTeacherClasses } from "@/redux/teacher-store/teacherThunks";
import Link from "next/link";
import LogoutButton from "@/app/components/LogoutButton";

export default function TeacherPage() {
  const dispatch = useAppDispatch();
  const { classes, loading } = useAppSelector((state) => state.teacher);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(getTeacherClasses());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 antialiased">
      {/* Sol panel */}
      <div className="w-1/4 bg-[#1087BB] text-white flex flex-col p-6">
        {/* Profil */}
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
          <Link
            href="/teacher/info"
            className="hover:bg-[#0d75a0] px-4 py-2 rounded text-left transition inline-block"
          >
            Profil Bilgilerim
          </Link>
          <LogoutButton />
        </nav>
      </div>

      {/* Sağ panel */}
      <div className="flex-1 flex flex-col">
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
              <div className="font-sans font-bold text-2xl text-[#1087BB]">
                Pusulam
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/" className="hover:text-[#1087BB] transition">
                Anasayfa
              </Link>
              <Link href="#about" className="hover:text-[#1087BB] transition">
                Hakkında
              </Link>
            </nav>
          </div>
        </header>

        {/* İçerik */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6 text-[#1087BB]">Sınıflarım</h1>

          {loading && <p>Sınıflar yükleniyor...</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <motion.div
                key={cls._id}
                className="bg-white shadow-lg rounded-lg p-4 cursor-pointer hover:scale-105 transition-transform"
                whileHover={{ scale: 1.05 }}
              >
                <Link href={`/teacher/class/${cls._id}`}>
                  <div>
                    <h2 className="font-bold text-lg text-[#1087BB]">{cls.name}</h2>
                    <p>Öğrenci Sayısı: 10</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600">
              © {new Date().getFullYear()} Pusulam Başarı Takip — Bitirme Projesi
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/privacy"
                className="text-sm text-slate-600 hover:underline transition"
              >
                Gizlilik
              </Link>
              <Link
                href="/contact"
                className="text-sm text-slate-600 hover:underline transition"
              >
                İletişim
              </Link>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-slate-600 hover:underline transition"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
