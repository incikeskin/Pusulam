"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUser } from "@/redux/auth-store/authThunks";
import Image from "next/image";
import { motion } from "framer-motion"; // animasyon için

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const authState = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      const role = result.payload.user.role;
      if (role === "teacher") router.push("/teacher");
      else if (role === "student") router.push("/student");
      else router.push("/"); // fallback
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
              fill // fill kullanırsan parent div ile boyutlanır
              className="object-contain opacity-70"
            />
          </div>
        </motion.div>

        <div className="z-10 text-white text-3xl font-bold px-6 text-center">
          <p>Pusulamın Yönü Daima Başarı!</p>
        </div>
      </div>

      {/* Sağ panel */}
      <div className="flex flex-1 items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 justify-center">
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
            Giriş Yap
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-slate-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#1087BB] transition"
            />
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-slate-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#1087BB] transition"
            />
            <button
              type="submit"
              className="bg-[#1087BB] text-white py-3 rounded-md font-medium hover:bg-[#0d75a0] transition-colors"
            >
              Giriş Yap
            </button>
          </form>

          {authState.error && (
            <p className="text-red-500 mt-4 text-center">{authState.error}</p>
          )}

          <div className="mt-6 text-center text-sm text-slate-600">
            Hesabın yok mu?{" "}
            <a
              href="/register"
              className="text-[#1087BB] hover:underline hover:text-[#0d75a0] transition-colors"
            >
              Kayıt Ol
            </a>
          </div>
        </div>
      </div>
    </div >
  );
}


