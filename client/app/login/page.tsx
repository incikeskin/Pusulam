"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUser } from "@/redux/auth-store/authThunks";

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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Giriş Yap</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-sm">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded mt-2"
        >
          Giriş Yap
        </button>
        {authState.error && <p className="text-red-500">{authState.error}</p>}
      </form>
    </div>
  );
}
