"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import LandingPage from "./components/LandingPage";

export default function Home() {
  const [data, setData] = useState<string>("");

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api`)
      .then(res => setData(res.data.message || JSON.stringify(res.data)))
      .catch(err => console.error("API bağlantı hatası:", err));
  }, []);

  return  <LandingPage />;
  
}

