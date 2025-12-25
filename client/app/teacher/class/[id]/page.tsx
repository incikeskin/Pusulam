"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, PlusCircle, Search } from "lucide-react";

import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchClassInfo,
  fetchClassStudents,
  fetchClassAssignments
} from "@/redux/classDetail-store/classDetailThunks";

import { addStudentToClass } from "@/redux/studentClassCreate-store/studentClassCreateThunks";
import { resetStudentClassCreate } from "@/redux/studentClassCreate-store/studentClassCreateSlice";
import { findStudent } from "@/redux/studentSearch-store/studentSearchThunks";
import { removeStudentFromClass } from "@/redux/studentClassCreate-store/studentClassCreateThunks";


export default function ClassPage() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const classId = params?.id as string;

  const { info, students, assignments, loading } = useSelector(
      (state: RootState) => state.classDetail
  );

  const { user } = useSelector((state: RootState) => state.auth);

  // 🔹 Modal ve input state
  const [modalOpen, setModalOpen] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPhone, setSearchPhone] = useState("");

  const { student, loading: searchLoading, error: searchError } = useSelector(
      (state: RootState) => state.studentSearch
  );

  const { loading: addLoading, success: addSuccess, error: addError } = useSelector(
      (state: RootState) => state.studentClassCreate
  );

  useEffect(() => {
    if (classId) {
      dispatch(fetchClassInfo(classId));
      dispatch(fetchClassStudents(classId));
      dispatch(fetchClassAssignments(classId));
    }
  }, [classId, dispatch]);

  // 🔹 Başarılı eklemeden sonra modal kapat ve öğrencileri yeniden fetch et
  useEffect(() => {
    if (addSuccess) {
      dispatch(fetchClassStudents(classId));
      setModalOpen(false);
      dispatch(resetStudentClassCreate());
    }
  }, [addSuccess, dispatch, classId]);

  const handleStudentSearch = () => {
    dispatch(findStudent({ email: searchEmail, phone_number: searchPhone }));
  };

  const handleAddStudent = () => {
    if (student) {
      dispatch(addStudentToClass({ studentId: student._id, classId }));
    }
  };

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
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">Sınıf Bilgileri</CardTitle>
              <Button onClick={() => setModalOpen(true)}>Öğrenci Ekle</Button>
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

                    <Link href={`/teacher/class/${classId}/assignments/${a._id}`}>
                      <Button variant="outline">Görüntüle</Button>
                    </Link>
                  </div>
              ))}

              <Link href={`/teacher/class/${classId}/assignments`}>
                <Button className="mt-4 w-full flex items-center gap-2 text-lg py-6">
                  <PlusCircle className="w-6 h-6" /> Yeni Ödev Oluştur
                </Button>
              </Link>

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
                      className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition cursor-pointer shadow-sm flex flex-col gap-2"
                  >
                    <div>
                      <p className="font-medium">{s.student.first_name} {s.student.last_name}</p>
                      <p className="text-gray-400 text-sm">Detayları Gör</p>
                    </div>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm(`${s.student.first_name} ${s.student.last_name} sınıftan çıkarılsın mı?`)) {
                            dispatch(removeStudentFromClass({ studentClassId: s._id }))
                                .unwrap()
                                .then(() => dispatch(fetchClassStudents(classId)))
                                .catch((err) => console.error(err));
                          }
                        }}
                    >
                      Çıkar
                    </Button>
                  </div>
              ))}
            </CardContent>
          </Card>
        </main>

        {/* Student Add Modal */}
        {modalOpen && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg space-y-4">
                <h2 className="text-xl font-bold text-[#1087BB]">Öğrenci Ekle</h2>

                <div className="flex flex-col gap-2">
                  <input
                      type="text"
                      placeholder="Email"
                      className="border p-2 rounded"
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                  />
                  <input
                      type="text"
                      placeholder="Telefon Numarası"
                      className="border p-2 rounded"
                      value={searchPhone}
                      onChange={(e) => setSearchPhone(e.target.value)}
                  />
                  <Button
                      onClick={handleStudentSearch}
                      disabled={searchLoading}
                      className="flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" /> Ara
                  </Button>
                </div>

                {searchError && <p className="text-red-500">{searchError}</p>}
                {student && (
                    <div className="p-4 border rounded flex flex-col gap-2 bg-gray-50">
                      <p>{student.first_name} {student.last_name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                      <Button
                          onClick={handleAddStudent}
                          disabled={addLoading}
                      >
                        {addLoading ? "Ekleniyor..." : "Sınıfa Ekle"}
                      </Button>
                      {addError && <p className="text-red-500">{addError}</p>}
                    </div>
                )}

                <Button variant="ghost" onClick={() => setModalOpen(false)}>
                  Kapat
                </Button>
              </div>
            </div>
        )}

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

