"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/auth-store/authSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function LogoutConfirm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <>
      {/* Mevcut tasarımı koruyan buton */}
      <button
        className="hover:bg-[#0d75a0] px-4 py-2 rounded text-left transition"
        onClick={() => setOpen(true)}
      >
        Çıkış
      </button>

      {/* Onay Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Çıkış Yap</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-600 mt-2">
            Çıkmak istediğinizden emin misiniz?
          </p>

          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              İptal
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Çıkış Yap
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}


