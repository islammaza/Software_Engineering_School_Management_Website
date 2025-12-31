// src/pages/StudentDetails.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { FileDown, ArrowLeft, Save, X, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  getStudentSummary,
  upsertAssessment,
  updateStudentReport,
  updateStudent,
  getReportDataForPdf,
  refreshReportSummary,
  type Assessment as AssessmentRow,
  type Module as ModuleRow,
  type Student as StudentRow,
} from "@/lib/api/student_report";
import { exportStudentReportPdf } from "@/lib/pdf/exportStudentReport";

// Local view model for module + assessment merged
interface ModuleView {
  id: string;
  name: string;
  grade: number | null;
  remark: string | null;
}

const StudentDetails = () => {
  const navigate = useNavigate();
  const { groupId, studentId } = useParams();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<StudentRow | null>(null);
  const [teacherName, setTeacherName] = useState<string>("");
  const [groupName, setGroupName] = useState<string>("");
  const [modules, setModules] = useState<ModuleView[]>([]);
  const [reportId, setReportId] = useState<string | null>(null);

  const [generalRemark, setGeneralRemark] = useState<string>("");
  const [editingGeneral, setEditingGeneral] = useState(false);
  const [tempGeneralRemark, setTempGeneralRemark] = useState(generalRemark);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempGrade, setTempGrade] = useState("");
  const [tempRemark, setTempRemark] = useState("");

  const finalAverage = useMemo(() => {
    const grades = modules
      .map((m) => m.grade)
      .filter((g): g is number => typeof g === "number");
    if (!grades.length) return 0;
    const avg = grades.reduce((sum, m) => sum + m, 0) / grades.length;
    return Number(avg.toFixed(2));
  }, [modules]);

  useEffect(() => {
    async function load() {
      if (!studentId) return;
      try {
        setLoading(true);
        const summary = await getStudentSummary(studentId);
        setStudent(summary.student);
        setGroupName(summary.group?.name ?? "");
        setTeacherName(summary.group?.teacher_name ?? "");
        setReportId(summary.report.id);
        setGeneralRemark(summary.report.final_observation ?? "");

        // merge modules with assessments
        const assessmentMap = new Map<string, AssessmentRow>();
        summary.assessments.forEach((a) => assessmentMap.set(a.module_id, a));
        const modViews: ModuleView[] = summary.modules.map((m: ModuleRow) => {
          const a = assessmentMap.get(m.id);
          return {
            id: m.id,
            name: m.name,
            grade: a?.score ?? null,
            remark: a?.remark ?? null,
          };
        });
        setModules(modViews);
        // Immediately sync final_note with current average at the beginning
        const initialGrades = modViews
          .map((mv) => mv.grade)
          .filter((g): g is number => typeof g === "number");
        const initialAvg = initialGrades.length
          ? Number(
              (
                initialGrades.reduce((s, v) => s + v, 0) / initialGrades.length
              ).toFixed(2)
            )
          : null;
        if (summary.report?.id) {
          await updateStudentReport(summary.report.id, {
            final_note: initialAvg,
          });
        }
      } catch (err: any) {
        toast({
          title: "خطأ في التحميل",
          description: err.message || "تعذر تحميل بيانات الطالب",
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [studentId]);

  const handleEdit = (
    id: string,
    grade: number | null,
    remark: string | null
  ) => {
    setEditingId(id);
    setTempGrade(grade != null ? grade.toString() : "");
    setTempRemark(remark ?? "");
  };

  const handleSave = async (id: string) => {
    const grade = parseInt(tempGrade);
    if (isNaN(grade) || grade < 0 || grade > 100) {
      toast({ title: "خطأ", description: "الدرجة يجب أن تكون بين 0 و100" });
      return;
    }

    if (!studentId) return;
    try {
      await upsertAssessment({
        student_id: studentId,
        module_id: id,
        score: grade,
        remark: tempRemark,
      });
      let nextModules: ModuleView[] = [];
      setModules((prev) => {
        nextModules = prev.map((m) =>
          m.id === id ? { ...m, grade, remark: tempRemark } : m
        );
        return nextModules;
      });
      // Sync final_note using backend aggregation to avoid race conditions
      await refreshReportSummary(studentId, { updateReportRow: true });
      setEditingId(null);
      setTempGrade("");
      setTempRemark("");
      toast({ title: "تم الحفظ", description: "تم تحديث تقييم الوحدة بنجاح" });
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message || "تعذر حفظ التقييم" });
    }
  };

  const handleSaveGeneralRemark = async () => {
    try {
      if (reportId) {
        await updateStudentReport(reportId, {
          final_observation: tempGeneralRemark,
        });
      }
      setGeneralRemark(tempGeneralRemark);
      setEditingGeneral(false);
      toast({
        title: "تم الحفظ",
        description: "تم تحديث ملاحظة الأستاذ بنجاح",
      });
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message || "تعذر حفظ الملاحظة" });
    }
  };

  const handleExportPDF = async () => {
    try {
      if (!studentId) return;
      await exportStudentReportPdf(studentId);
      toast({ title: "تم التنزيل", description: "تم إنشاء وتنزيل ملف PDF" });
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message || "تعذر تجهيز ملف PDF" });
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* زر الرجوع */}
          <div className="mb-6">
            <Button
              onClick={() => navigate(`/groups/${groupId}`)}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white text-lg px-8 py-5"
            >
              <ArrowLeft className="w-5 h-5 ml-2" />
              رجوع إلى قائمة الطلاب
            </Button>
          </div>

          {/* التقرير الرسمي */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-double border-[var(--gold)] p-8">
            {/* رأس التقرير */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-black text-gradient-durar mb-6">
                تقرير أداء الطالب
              </h1>
              <div className="w-full h-2 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-80 mb-8" />

                <div className="grid grid-cols-2 gap-6 text-right text-lg font-bold">
                  <div>
                    <p className="text-muted-foreground">اسم الطالب</p>
                    <p className="text-2xl text-primary mt-1">
                      {student?.full_name || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">المجموعة</p>
                    <p className="text-2xl text-primary mt-1">
                      {groupName || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">التاريخ</p>
                    <p className="text-xl text-primary mt-1">
                      {new Date().toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">الأستاذ</p>
                    <p className="text-xl text-primary mt-1">
                      {teacherName || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* جدول التقييم */}
              <div className="bg-gradient-to-r from-primary/5 to-[var(--gold)]/5 rounded-2xl p-6 border border-primary/20 mb-8">
                <h2 className="text-3xl font-black text-center text-gradient-durar mb-6">
                  تقييم الوحدات الدراسية
                </h2>

              <div className="space-y-5">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className="bg-white rounded-xl shadow p-5 border border-border/30"
                  >
                    <div className="grid grid-cols-3 gap-4 items-center text-right">
                      <div>
                        <h3 className="text-xl font-black text-primary">
                          {module.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          &nbsp;
                        </p>
                      </div>

                        <div className="text-center">
                          {editingId === module.id ? (
                            <Input
                              type="number"
                              value={tempGrade}
                              onChange={(e) => setTempGrade(e.target.value)}
                              className="w-24 text-3xl font-black text-center"
                              placeholder="0-100"
                            />
                          ) : (
                            <p className="text-5xl font-black text-primary">
                              {module.grade ?? 0}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            من 100
                          </p>
                        </div>

                      <div className="text-right">
                        {editingId === module.id ? (
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
                                onClick={() => handleSave(module.id)}
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
                              {module.remark || "—"}
                            </p>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="mt-3 text-primary hover:text-[var(--gold)]"
                              onClick={() =>
                                handleEdit(
                                  module.id,
                                  module.grade,
                                  module.remark
                                )
                              }
                            >
                              <Edit className="w-4 h-4 ml-1" />
                              تعديل
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

              {/* المتوسط العام */}
              <div className="text-center mb-10">
                <div className="inline-block bg-gray-100 rounded-2xl px-16 py-10 shadow-xl border border-gray-300">
                  <p className="text-2xl font-bold text-gray-800 mb-3">
                    المعدل النهائي
                  </p>
                  <p className="text-7xl font-black text-gray-900">
                    {finalAverage}
                  </p>
                  <p className="text-xl text-gray-600 mt-2">من 100</p>
                </div>
              </div>

            {/* ملاحظة الأستاذ العامة – قابلة للتعديل */}
            <div className="bg-gradient-to-r from-primary/5 to-[var(--gold)]/5 rounded-2xl p-6 border border-primary/20 mb-10">
              <h3 className="text-2xl font-black text-center text-gradient-durar mb-5">
                ملاحظة الأستاذ المشرف
              </h3>

                {editingGeneral ? (
                  <div className="bg-white rounded-xl p-8 shadow space-y-4">
                    <Textarea
                      value={tempGeneralRemark}
                      onChange={(e) => setTempGeneralRemark(e.target.value)}
                      rows={6}
                      className="text-right text-lg leading-relaxed"
                      placeholder="اكتب ملاحظتك العامة عن الطالب..."
                    />
                    <div className="flex justify-end gap-3">
                      <Button
                        onClick={handleSaveGeneralRemark}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-5 h-5 ml-2" />
                        حفظ الملاحظة
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setTempGeneralRemark(generalRemark);
                          setEditingGeneral(false);
                        }}
                      >
                        <X className="w-5 h-5" />
                        إلغاء
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="bg-white rounded-xl p-8 shadow cursor-pointer hover:shadow-xl transition-all border border-primary/10"
                    onClick={() => {
                      setTempGeneralRemark(generalRemark);
                      setEditingGeneral(true);
                    }}
                  >
                    <p className="text-lg text-right leading-relaxed text-foreground">
                      {generalRemark ||
                        "اضغط هنا لإضافة ملاحظة عامة عن الطالب..."}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="mt-4 text-primary hover:text-[var(--gold)]"
                    >
                      <Edit className="w-4 h-4 ml-2" />
                      تعديل الملاحظة
                    </Button>
                  </div>
                )}
              </div>

              {/* زر التصدير */}
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleExportPDF}
                  className="bg-gradient-to-r from-primary to-[var(--gold)] text-white text-2xl px-20 py-8 shadow-xl"
                >
                  <FileDown className="w-8 h-8 ml-4" />
                  تصدير التقرير كـ PDF
                </Button>
              </div>

              {/* آية */}
              <div className="text-center mt-16">
                <div className="w-full h-2 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-80 my-10" />
                <p className="text-3xl font-amiri italic text-gradient-durar leading-relaxed max-w-4xl mx-auto">
                  "فَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ ۖ وَمَنْ
                  يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ"
                </p>
                <p className="text-lg text-muted-foreground mt-6">
                  سورة الزلزلة
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDetails;
