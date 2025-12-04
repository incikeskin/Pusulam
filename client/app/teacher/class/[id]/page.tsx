"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, PlusCircle } from "lucide-react";

import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchClassInfo,        // 🔹 değiştirildi
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

  // ❗ Sayfa açıldığında sınıf bilgisi + öğrenciler + ödevler çekilir
  useEffect(() => {
    if (classId) {
      dispatch(fetchClassInfo(classId));        // 🔹 doğru thunk
      dispatch(fetchClassStudents(classId));
      dispatch(fetchClassAssignments(classId));
    }
  }, [classId, dispatch]);

  if (loading || !info) {
    return <p className="p-8 text-lg">Yükleniyor...</p>;
  }

  return (
    <div className="p-8 space-y-8">
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
    </div>
  );
}


