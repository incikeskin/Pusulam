"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initAuth } from "@/redux/auth-store/authSlice";

export default function ClientInit() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  return null; // UI yok, sadece init
}
