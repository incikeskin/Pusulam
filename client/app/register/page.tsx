"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { registerUser } from "@/redux/auth-store/authThunks";
import Image from "next/image";
import { motion } from "framer-motion";
import { Dropdown } from 'primereact/dropdown';

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const authState = useAppSelector((state) => state.auth);
  const { loading, error } = authState;

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    role: "student",
  });

  const roles = [
    { label: 'Student', value: 'student' },
    { label: 'Teacher', value: 'teacher' }
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(registerUser(form)).unwrap();
      alert("Kayıt başarılı! Lütfen giriş yapın.");
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sol panel */}
      <div className="hidden md:flex md:w-1/2 bg-[#1087BB] relative items-center justify-center overflow-hidden">
        <motion.div
          className="absolute w-40 h-40 flex items-center justify-center"
          animate={{ y: [0, -20, 0], opacity: [0.8, 0.5, 0.8] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-full">
            <Image
              src="/images/pusulam_logo.png"
              alt="Pusulam Logo"
              fill
              className="object-contain opacity-70"
            />
          </div>
        </motion.div>

        <div className="z-10 text-white text-3xl font-bold px-6 text-center">
          <p>Pusulam Sana Başarıya Giden Yolu Gösterecek!</p>
        </div>
      </div>

      {/* Sağ panel */}
      <div className="flex flex-1 items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-[380px] bg-white shadow-lg rounded-lg p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6 justify-center">
            <Image
              src="/images/pusulam_logo.png"
              alt="Pusulam Logo"
              width={50}
              height={50}
              className="object-contain"
            />
            <span className="text-[#1087BB] font-bold text-2xl">Pusulam</span>
          </div>

          {/* Form */}
          <h1 className="text-2xl font-bold text-center text-[#1087BB] mb-6">
            Kayıt Ol
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              name="first_name"
              placeholder="İsim"
              value={form.first_name}
              onChange={handleChange}
              className="border border-slate-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-[#1087BB] placeholder-slate-400 transition"
            />
            <input
              type="text"
              name="last_name"
              placeholder="Soyisim"
              value={form.last_name}
              onChange={handleChange}
              className="border border-slate-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-[#1087BB] placeholder-slate-400 transition"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="border border-slate-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-[#1087BB] placeholder-slate-400 transition"
            />
            <input
              type="password"
              name="password"
              placeholder="Şifre"
              value={form.password}
              onChange={handleChange}
              className="border border-slate-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-[#1087BB] placeholder-slate-400 transition"
            />
            <input
              type="text"
              name="phone_number"
              placeholder="Telefon"
              value={form.phone_number}
              onChange={handleChange}
              className="border border-slate-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-[#1087BB] placeholder-slate-400 transition"
            />
            {/* Role seçimi */}
            <Dropdown
              value={form.role}
              options={roles}
              onChange={(e) => setForm({ ...form, role: e.value })}
              placeholder="Rol Seçin"
              className="w-full"
            />


            <button
              type="submit"
              disabled={loading}
              className="bg-[#1087BB] text-white py-2.5 rounded-md font-medium hover:bg-[#0d75a0] transition-colors"
            >
              {loading ? "Yükleniyor..." : "Kayıt Ol"}
            </button>
          </form>

          {error && (
            <p className="text-red-500 mt-4 text-center">{error}</p>
          )}

          <div className="mt-6 text-center text-sm text-slate-600">
            Hesabın var mı?{" "}
            <a
              href="/login"
              className="text-[#1087BB] hover:underline hover:text-[#0d75a0] transition-colors"
            >
              Giriş Yap
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
