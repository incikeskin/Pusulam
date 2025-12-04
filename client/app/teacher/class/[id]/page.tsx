"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, PlusCircle } from "lucide-react";

import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchClassInfo,
  fetchClassStudents,
  fetchClassAssignments
} from "@/redux/classDetail-store/classDetailThunks";

export default function ClassPage() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const classId = params?.id as string;

  const { info, students, assignments, loading } = useSelector(
    (state: RootState) => state.classDetail
  );

  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (classId) {
      dispatch(fetchClassInfo(classId));
      dispatch(fetchClassStudents(classId)).unwrap()
      .then((res) => console.log("STUDENTS THUNK RES:", res))
      .catch((err) => console.error("STUDENTS THUNK ERR:", err));;
      dispatch(fetchClassAssignments(classId));
    }
  }, [classId, dispatch]);

  if (loading || !info) {
    return <p className="p-8 text-lg">Yükleniyor...</p>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
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
            <div className="font-sans font-bold text-2xl text-[#1087BB]">Pusulam</div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="hover:text-[#1087BB] transition">Anasayfa</Link>
            <Link href="/teacher" className="hover:text-[#1087BB] transition">Sınıflarım</Link>
            <Link href="/teacher" className="hover:text-[#1087BB] transition">Çıkış</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8 max-w-6xl mx-auto w-full">
        {/* Class Info */}
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Sınıf Bilgileri</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 text-lg">
            <div className="p-4 bg-white/5 rounded-xl shadow-sm">
              <p className="text-gray-400">Sınıf Adı</p>
              <p className="font-semibold">{info.name}</p>
            </div>

            <div className="p-4 bg-white/5 rounded-xl shadow-sm">
              <p className="text-gray-400">Öğretmen Adı</p>
              <p className="font-semibold">
                {user ? `${user.first_name} ${user.last_name}` : "—"}
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-xl shadow-sm flex items-center gap-2">
              <Users className="w-5 h-5" />
              <div>
                <p className="text-gray-400">Öğrenci Sayısı</p>
                <p className="font-semibold">{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignments Section */}
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6" /> Verilen Ödevler
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {assignments.length === 0 && (
              <p className="text-gray-400 text-sm">Bu sınıfa henüz ödev verilmemiş.</p>
            )}

            {assignments.map((a) => (
              <div
                key={a._id}
                className="flex justify-between items-center p-4 bg-white/5 rounded-xl"
              >
                <div>
                  <p className="font-semibold">{a.title}</p>
                  <p className="text-gray-400 text-sm">
                    Son teslim: {a.due_date || "—"}
                  </p>
                </div>

                <Button variant="outline">Görüntüle</Button>
              </div>
            ))}

            <Button className="mt-4 w-full flex items-center gap-2 text-lg py-6">
              <PlusCircle className="w-6 h-6" /> Yeni Ödev Oluştur
            </Button>
          </CardContent>
        </Card>

        {/* Students Section */}
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6" /> Sınıftaki Öğrenciler
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((s) => (
              <div
                key={s._id}
                className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition cursor-pointer shadow-sm"
              >
                <p className="font-medium">
                  {s.student.first_name} {s.student.last_name}
                </p>
                <p className="text-gray-400 text-sm">Detayları Gör</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-600">
            © {new Date().getFullYear()} Pusulam Başarı Takip — Bitirme Projesi
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <Link href="/privacy" className="text-sm text-slate-600 hover:underline transition">Gizlilik</Link>
            <Link href="/contact" className="text-sm text-slate-600 hover:underline transition">İletişim</Link>
            <a href="https://github.com/" target="_blank" rel="noreferrer" className="text-sm text-slate-600 hover:underline transition">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}


