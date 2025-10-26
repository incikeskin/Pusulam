"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [data, setData] = useState<string>("");

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api`)
      .then(res => setData(res.data.message || JSON.stringify(res.data)))
      .catch(err => console.error("API bağlantı hatası:", err));
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Next.js → Express Bağlantı Testi</h1>
      <p className="text-lg">{data || "Bağlantı kuruluyor..."}</p>
    </main>
  );
}

