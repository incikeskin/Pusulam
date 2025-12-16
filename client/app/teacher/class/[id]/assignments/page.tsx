"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PlusCircle, BookOpen, FileText } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

/* -------- assignment-create -------- */
import {
  createAssignment,
  setFormField,
  addSelectedQuestion,
  removeSelectedQuestion,
} from "@/redux/assignment-create-store";

/* -------- question-pool -------- */
import {
  fetchCategories,
  fetchQuestionsByCategory,
  setSelectedCategory,
  setSelectedDifficulty,
} from "@/redux/question-pool-store";

export default function CreateAssignmentPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();

  /* ---------- IDS ---------- */
  const classId = params.id as string;
  const teacherId = useAppSelector((state) => state.auth.user?._id);

  /* ---------- STATE ---------- */
  const { form, selectedQuestionIds, loading } = useAppSelector(
    (state) => state.assignmentCreate
  );

  const {
    categories,
    questions,
    selectedCategoryId,
    selectedDifficulty,
  } = useAppSelector((state) => state.questionPool);

  /* ---------- EFFECTS ---------- */
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCategoryId) {
      dispatch(
        fetchQuestionsByCategory({
          categoryId: selectedCategoryId,
          difficulty: selectedDifficulty || undefined,
        })
      );
    }
  }, [dispatch, selectedCategoryId, selectedDifficulty]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = () => {
    if (!classId || !teacherId) {
      toast({
        title: "Hata ❌",
        description: "Sınıf veya öğretmen bilgisi bulunamadı",
        variant: "destructive",
      });
      return;
    }

    if (!form.title.trim()) {
      toast({
        title: "Eksik bilgi",
        description: "Ödev başlığı zorunludur",
        variant: "destructive",
      });
      return;
    }

    if (!selectedQuestionIds.length) {
      toast({
        title: "Eksik bilgi",
        description: "En az 1 soru seçmelisiniz",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      createAssignment({
        classId,
        teacherId,
      })
    )
      .unwrap()
      .then(() => {
        toast({
          title: "Ödev oluşturuldu 🎉",
          description: "Ödev başarıyla sınıfa eklendi",
        });

        router.push(`/teacher/class/${classId}`);
      })
      .catch((err) => {
        toast({
          title: "Hata ❌",
          description: err || "Ödev oluşturulurken bir hata oluştu",
          variant: "destructive",
        });
      });
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-slate-50 p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <PlusCircle className="w-7 h-7" />
          Yeni Ödev Oluştur
        </h1>
        <p className="text-gray-500 mt-2">
          Bu sayfadan sınıfınıza yeni bir ödev tanımlayabilirsiniz.
        </p>
      </div>

      {/* Assignment Info */}
      <Card className="rounded-2xl shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Ödev Bilgileri
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Ödev Başlığı"
            value={form.title}
            onChange={(e) =>
              dispatch(setFormField({ field: "title", value: e.target.value }))
            }
          />

          <Textarea
            placeholder="Ödev Açıklaması"
            rows={4}
            value={form.description}
            onChange={(e) =>
              dispatch(
                setFormField({
                  field: "description",
                  value: e.target.value,
                })
              )
            }
          />

          <Input
            type="date"
            value={form.due_date}
            onChange={(e) =>
              dispatch(
                setFormField({
                  field: "due_date",
                  value: e.target.value,
                })
              )
            }
          />
        </CardContent>
      </Card>

      {/* Question Selection */}
      <Card className="rounded-2xl shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Sorular
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4">
            <select
              className="border rounded px-3 py-2"
              value={selectedCategoryId || ""}
              onChange={(e) =>
                dispatch(setSelectedCategory(e.target.value || null))
              }
            >
              <option value="">Kategori Seç</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              className="border rounded px-3 py-2"
              value={selectedDifficulty || ""}
              onChange={(e) =>
                dispatch(setSelectedDifficulty(e.target.value as any))
              }
            >
              <option value="">Zorluk</option>
              <option value="easy">Kolay</option>
              <option value="medium">Orta</option>
              <option value="hard">Zor</option>
            </select>
          </div>

          {/* Question Pool */}
          <div className="space-y-3">
            {questions.map((q) => (
              <div
                key={q._id}
                className="flex items-start gap-3 p-3 border rounded-xl"
              >
                <Checkbox
                  checked={selectedQuestionIds.includes(q._id)}
                  onCheckedChange={(checked) =>
                    checked
                      ? dispatch(addSelectedQuestion(q._id))
                      : dispatch(removeSelectedQuestion(q._id))
                  }
                />
                <div>
                  <p className="font-medium">{q.text}</p>
                  <p className="text-sm text-gray-500">
                    {q.category?.name} · {q.difficulty}
                  </p>
                </div>
              </div>
            ))}

            {!questions.length && selectedCategoryId && (
              <p className="text-sm text-gray-500">
                Bu kategori için soru bulunamadı.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          İptal
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Oluşturuluyor..." : "Ödevi Oluştur"}
        </Button>
      </div>
    </div>
  );
}

