"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getTeacherClasses } from "@/redux/teacher-store/teacherThunks";
import Link from "next/link";

export default function TeacherPage() {
  const dispatch = useAppDispatch();

  const { classes, loading } = useAppSelector((state) => state.teacher);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(getTeacherClasses());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex">
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

          {/* Redux'tan gelen öğretmen adı */}
          <h2 className="text-xl font-bold">
            {user ? `${user.first_name} ${user.last_name}` : "Öğretmen"}
          </h2>

          {/* Gösterimlik branş → backend’den öğretmen branşı gelirse değişeceğiz */}
          <p className="text-sm">{user?.role === "teacher" ? "Öğretmen" : ""}</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4 mt-6">
          <button className="hover:bg-[#0d75a0] px-4 py-2 rounded text-left transition">
            Profil
          </button>
          <button className="hover:bg-[#0d75a0] px-4 py-2 rounded text-left transition">
            Sınıflar
          </button>
          <button className="hover:bg-[#0d75a0] px-4 py-2 rounded text-left transition">
            Çıkış
          </button>
        </nav>
      </div>

      {/* Sağ panel */}
      <div className="flex-1 bg-slate-50 p-6">
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
      </div>
    </div>
  );
}

