// src/pages/ModuleDetails.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { ArrowRight, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getModuleWithAssessments, upsertAssessment } from "@/lib/api/modules";

interface StudentGrade {
  studentId: number;
  studentName: string;
  grade: number | null;
  remark: string;
  assessmentId?: string | null;
}

const ModuleDetails = () => {
  const navigate = useNavigate();
  const { groupId, moduleId } = useParams();
  const { toast } = useToast();

  const [moduleName, setModuleName] = useState("");
  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempGrade, setTempGrade] = useState("");
  const [tempRemark, setTempRemark] = useState("");

  // Fetch module and student assessments
  useEffect(() => {
    if (!moduleId) return;

    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await getModuleWithAssessments(moduleId);

      if (error) {
        toast({
          title: "خطأ",
          description: "فشل تحميل بيانات الوحدة",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (data) {
        setModuleName(data.module.name);
        setStudents(data.students);
      }
      setLoading(false);
    };

    fetchData();
  }, [moduleId]);

  const handleEdit = (id: number, grade: number | null, remark: string) => {
    setEditingId(id);
    setTempGrade(grade?.toString() || "");
    setTempRemark(remark);
  };

  const handleSave = async (id: number) => {
    const grade = parseInt(tempGrade);
    if (isNaN(grade) || grade < 0 || grade > 100) {
      toast({
        title: "خطأ",
        description: "الدرجة يجب أن تكون بين 0 و100",
        variant: "destructive",
      });
      return;
    }

    if (!moduleId) return;

    // Save to database
    const { error } = await upsertAssessment({
      student_id: id,
      module_id: moduleId,
      score: grade,
      remark: tempRemark,
    });

    if (error) {
      toast({
        title: "خطأ",
        description: "فشل حفظ التقييم: " + error.message,
        variant: "destructive",
      });
      return;
    }

    // Update local state
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === id ? { ...s, grade, remark: tempRemark } : s
      )
    );

    setEditingId(null);
    setTempGrade("");
    setTempRemark("");
    toast({ title: "تم الحفظ", description: "تم تحديث تقييم الطالب بنجاح" });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* زر الرجوع في اليمين (مثل كل المواقع العربية) */}
          <div className="mb-8 text-right">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white text-lg px-8 py-5 shadow-lg"
            >
              رجوع
              <ArrowRight className="w-scale-x-100 w-5 h-5 mr-2" />{" "}
              {/* سهم يمين معكوس عشان يبقى يسار */}
            </Button>
          </div>

          {/* عنوان الوحدة */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-gradient-durar">
              تقييم الطلاب في الوحدة:
            </h1>
            <h2 className="text-3xl font-bold text-primary mt-3">
              {moduleName || "جاري التحميل..."}
            </h2>
            <div className="w-full h-2 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-80 my-8 max-w-xl mx-auto" />
          </div>

          {/* Student assessments */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-double border-[var(--gold)] p-8">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                جاري تحميل البيانات...
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                لا يوجد طلاب في هذه المجموعة
              </div>
            ) : (
              <div className="space-y-6">
                {students.map((student) => (
                  <div
                    key={student.studentId}
                    className="bg-gradient-to-r from-primary/5 to-[var(--gold)]/5 rounded-xl p-6 border border-primary/20"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      <div className="text-right">
                        <h3 className="text-xl font-black text-primary">
                          {student.studentName}
                        </h3>
                      </div>

                      <div className="text-center">
                        {editingId === student.studentId ? (
                          <Input
                            type="number"
                            value={tempGrade}
                            onChange={(e) => setTempGrade(e.target.value)}
                            className="w-24 text-3xl font-black text-center"
                            placeholder="0-100"
                          />
                        ) : (
                          <p className="text-5xl font-black text-primary">
                            {student.grade || "-"}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">
                          من 100
                        </p>
                      </div>

                      <div className="text-right">
                        {editingId === student.studentId ? (
                          <div className="space-y-3">
                            <Textarea
                              value={tempRemark}
                              onChange={(e) => setTempRemark(e.target.value)}
                              rows={3}
                              className="text-right text-sm"
                              placeholder="ملاحظة الأستاذ..."
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleSave(student.studentId)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Save className="w-4 h-4 ml-1" />
                                حفظ
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingId(null)}
                              >
                                <X className="w-4 h-4" />
                                إلغاء
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm leading-relaxed text-muted-foreground italic">
                              {student.remark || "لا توجد ملاحظات"}
                            </p>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="mt-3 text-primary hover:text-[var(--gold)]"
                              onClick={() =>
                                handleEdit(
                                  student.studentId,
                                  student.grade,
                                  student.remark
                                )
                              }
                            >
                              {student.grade ? "تعديل" : "إضافة تقييم"}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* آية في الأسفل */}
          <div className="text-center py-16 mt-12">
            <div className="w-full h-2 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-80 my-10 max-w-xl mx-auto" />
            <p className="text-3xl font-amiri italic text-gradient-durar leading-relaxed max-w-4xl mx-auto px-6">
              "وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا ۝ وَيَرْزُقْهُ
              مِنْ حَيْثُ لَا يَحْتَسِبُ"
            </p>
            <p className="text-lg text-muted-foreground mt-6 font-bold">
              سورة الطلاق • الآيتان 2-3
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ModuleDetails;
