"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { registerUser } from "@/redux/auth-store/authThunks";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    role: "student", // default role
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Kayıt Ol</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 w-full max-w-sm"
      >
        <input
          type="text"
          name="first_name"
          placeholder="İsim"
          value={form.first_name}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Soyisim"
          value={form.last_name}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Şifre"
          value={form.password}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Telefon"
          value={form.phone_number}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* Role seçimi */}
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white p-2 rounded mt-2"
        >
          {loading ? "Yükleniyor..." : "Kayıt Ol"}
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}

