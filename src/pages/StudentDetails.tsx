// src/pages/StudentDetails.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { FileDown, ArrowLeft, Save, X, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Module {
  id: number;
  name: string;
  progress: string;
  grade: number;
  remark: string;
}

const StudentDetails = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const { toast } = useToast();

  const student = {
    name: "عبدالله بن محمد",
    group: "مجموعة الفرقان",
    teacher: "أحمد محمود",
    date: new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" }),
  };

  const [modules, setModules] = useState<Module[]>([
    { id: 1, name: "سورة البقرة", progress: "3/4 جزء", grade: 95, remark: "أداء ممتاز في المتشابهات، يحتاج مراجعة بسيطة" },
    { id: 2, name: "التجويد", progress: "ممتاز", grade: 98, remark: "متمكن من أحكام النون والميم والمدود" },
    { id: 3, name: "سورة آل عمران", progress: "1/2 جزء", grade: 80, remark: "يحتاج تركيز أكثر في الحفظ الجديد" },
    { id: 4, name: "مراجعة الجزء 30", progress: "كامل", grade: 100, remark: "مراجعة يومية مستمرة، ممتاز" },
    { id: 5, name: "الانضباط والسلوك", progress: "ممتاز", grade: 97, remark: "ملتزم، محترم، يساعد زملاءه" },
  ]);

  // ملاحظة الأستاذ العامة – قابلة للتعديل
  const [generalRemark, setGeneralRemark] = useState(
    "طالب مجتهد جدًا، يتمتع بأخلاق عالية وصوت جميل في التلاوة، يحتاج فقط إلى الاستمرارية في المراجعة ليصل إلى درجة الإتقان الكامل إن شاء الله."
  );
  const [editingGeneral, setEditingGeneral] = useState(false);
  const [tempGeneralRemark, setTempGeneralRemark] = useState(generalRemark);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempGrade, setTempGrade] = useState("");
  const [tempRemark, setTempRemark] = useState("");

  const finalAverage = Math.round(modules.reduce((sum, m) => sum + m.grade, 0) / modules.length);

  const handleEdit = (id: number, grade: number, remark: string) => {
    setEditingId(id);
    setTempGrade(grade.toString());
    setTempRemark(remark);
  };

  const handleSave = (id: number) => {
    const grade = parseInt(tempGrade);
    if (isNaN(grade) || grade < 0 || grade > 100) {
      toast({ title: "خطأ", description: "الدرجة يجب أن تكون بين 0 و100" });
      return;
    }

    setModules(prev =>
      prev.map(m => (m.id === id ? { ...m, grade, remark: tempRemark } : m))
    );

    setEditingId(null);
    setTempGrade("");
    setTempRemark("");
    toast({ title: "تم الحفظ", description: "تم تحديث تقييم الوحدة بنجاح" });
  };

  const handleSaveGeneralRemark = () => {
    setGeneralRemark(tempGeneralRemark);
    setEditingGeneral(false);
    toast({ title: "تم الحفظ", description: "تم تحديث ملاحظة الأستاذ بنجاح" });
  };

  const handleExportPDF = () => {
    toast({ title: "تم التصدير", description: "تقرير الطالب عبدالله بن محمد جاهز للطباعة" });
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
              <h1 className="text-4xl font-black text-gradient-durar mb-6">تقرير أداء الطالب</h1>
              <div className="w-full h-2 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-80 mb-8" />
              
              <div className="grid grid-cols-2 gap-6 text-right text-lg font-bold">
                <div><p className="text-muted-foreground">اسم الطالب</p><p className="text-2xl text-primary mt-1">{student.name}</p></div>
                <div><p className="text-muted-foreground">المجموعة</p><p className="text-2xl text-primary mt-1">{student.group}</p></div>
                <div><p className="text-muted-foreground">التاريخ</p><p className="text-xl text-primary mt-1">{student.date}</p></div>
                <div><p className="text-muted-foreground">الأستاذ</p><p className="text-xl text-primary mt-1">{student.teacher}</p></div>
              </div>
            </div>

            {/* جدول التقييم */}
            <div className="bg-gradient-to-r from-primary/5 to-[var(--gold)]/5 rounded-2xl p-6 border border-primary/20 mb-8">
              <h2 className="text-3xl font-black text-center text-gradient-durar mb-6">
                تقييم الوحدات الدراسية
              </h2>

              <div className="space-y-5">
                {modules.map((module) => (
                  <div key={module.id} className="bg-white rounded-xl shadow p-5 border border-border/30">
                    <div className="grid grid-cols-3 gap-4 items-center text-right">
                      <div>
                        <h3 className="text-xl font-black text-primary">{module.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{module.progress}</p>
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
                          <p className="text-5xl font-black text-primary">{module.grade}</p>
                        )}
                        <p className="text-sm text-muted-foreground">من 100</p>
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
                              <Button size="sm" onClick={() => handleSave(module.id)} className="bg-green-600 hover:bg-green-700">
                                <Save className="w-4 h-4 ml-1" />
                                حفظ
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                                <X className="w-4 h-4" />
                                إلغاء
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm leading-relaxed text-muted-foreground italic">
                              {module.remark}
                            </p>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="mt-3 text-primary hover:text-[var(--gold)]"
                              onClick={() => handleEdit(module.id, module.grade, module.remark)}
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
                <p className="text-2xl font-bold text-gray-800 mb-3">المعدل النهائي</p>
                <p className="text-7xl font-black text-gray-900">{finalAverage}</p>
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
                    <Button onClick={handleSaveGeneralRemark} className="bg-green-600 hover:bg-green-700">
                      <Save className="w-5 h-5 ml-2" />
                      حفظ الملاحظة
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setTempGeneralRemark(generalRemark);
                      setEditingGeneral(false);
                    }}>
                      <X className="w-5 h-5" />
                      إلغاء
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 shadow cursor-pointer hover:shadow-xl transition-all border border-primary/10"
                  onClick={() => {
                    setTempGeneralRemark(generalRemark);
                    setEditingGeneral(true);
                  }}
                >
                  <p className="text-lg text-right leading-relaxed text-foreground">
                    {generalRemark || "اضغط هنا لإضافة ملاحظة عامة عن الطالب..."}
                  </p>
                  <Button size="sm" variant="ghost" className="mt-4 text-primary hover:text-[var(--gold)]">
                    <Edit className="w-4 h-4 ml-2" />
                    تعديل الملاحظة
                  </Button>
                </div>
              )}
            </div>

            {/* زر التصدير */}
            <div className="flex justify-center">
              <Button size="lg" onClick={handleExportPDF} className="bg-gradient-to-r from-primary to-[var(--gold)] text-white text-2xl px-20 py-8 shadow-xl">
                <FileDown className="w-8 h-8 ml-4" />
                تصدير التقرير كـ PDF
              </Button>
            </div>

            {/* آية */}
            <div className="text-center mt-16">
              <div className="w-full h-2 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-80 my-10" />
              <p className="text-3xl font-amiri italic text-gradient-durar leading-relaxed max-w-4xl mx-auto">
                "فَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ ۖ وَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ"
              </p>
              <p className="text-lg text-muted-foreground mt-6">سورة الزلزلة</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDetails;