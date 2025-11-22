// src/pages/GroupDetails.tsx
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Edit, FileCheck2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const group = { id, name: "مجموعة الفرقان", teacher: "أحمد محمود" };

  const students = [
    { id: 1, name: "عبد الرحمن بن صالح", level: "ممتاز", attendance: "100%" },
    { id: 2, name: "يوسف بن علي", level: "جيد جدًا", attendance: "95%" },
    { id: 3, name: "خالد بن أحمد", level: "ممتاز", attendance: "98%" },
    { id: 4, name: "سليمان القريشي", level: "متوسط", attendance: "72%" },
    { id: 5, name: "عمر بن الخطاب", level: "يحتاج دعم", attendance: "65%" },
  ];

  const modules = [
    { id: 1, title: "سورة البقرة", description: "حفظ من الآية 1 إلى 141" },
    { id: 2, title: "مراجعة الجزء 30", description: "مراجعة كاملة مع التجويد" },
    { id: 3, title: "آداب طالب العلم", description: "دروس تربوية أسبوعية" },
  ];

  const recentSessions = [
    { date: "20 نوفمبر", present: 14, late: 1, absent: 0 },
    { date: "19 نوفمبر", present: 13, late: 1, absent: 1 },
    { date: "18 نوفمبر", present: 15, late: 0, absent: 0 },
    { date: "17 نوفمبر", present: 12, late: 2, absent: 1 },
    { date: "16 نوفمبر", present: 14, late: 1, absent: 0 },
    { date: "15 نوفمبر", present: 13, late: 1, absent: 1 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-12">

        {/* عنوان المجموعة */}
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gradient-royal mb-4">
            {group.name}
          </h1>
          <p className="text-2xl text-[var(--gold)] font-medium">المعلم: {group.teacher}</p>
          <div className="w-full h-2 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-70 my-10" />
        </div>

        {/* أزرار علوية */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Button size="lg" onClick={() => navigate(`/groups/${id}/students/add`)}>
            <Plus className="w-5 h-5 ml-2" /> إضافة طالب
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate(`/groups/${id}/edit`)} className="border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black">
            <Edit className="w-5 h-5 ml-2" /> تعديل المجموعة
          </Button>
          <Button size="lg" className="bg-gradient-to-r from-primary to-[var(--gold)] text-white" onClick={() => navigate("/attendance")}>
            <FileCheck2 className="w-5 h-5 ml-2" /> تسجيل حضور اليوم
          </Button>
        </div>

        {/* الطلاب + الوحدات */}
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-y-6 gap-x-10 lg:gap-x-16 xl:gap-x-24">
          {/* الطلاب */}
          <div className="lg:col-span-5">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium border-b border-border">
                <div className="col-span-4">الاسم الكامل</div>
                <div className="col-span-3" />
                <div className="col-span-3 text-center">التفاصيل</div>
                <div className="col-span-2 text-center">الإجراءات</div>
              </div>

              <div className="divide-y divide-border">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/30 transition-smooth"
                  >
                    <div className="col-span-4 font-medium">{student.name}</div>
                    <div className="col-span-3" />
                    <div className="col-span-3 text-center">
                      <Button
                        variant="link"
                        className="text-primary"
                        onClick={() => navigate(`/groups/${id}/students/${student.id}`)}
                      >
                        تفاصيل
                      </Button>
                    </div>
                    <div className="col-span-2 flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-primary"
                        onClick={() => navigate(`/groups/${id}/students/${student.id}/edit`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-destructive"
                        onClick={() => alert("تم حذف الطالب")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* الوحدات */}
          <div className="lg:col-span-3">
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">قائمة الوحدات</h2>
                <Button size="sm" onClick={() => navigate(`/groups/${id}/modules/add`)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  إضافة وحدة
                </Button>
              </div>

              <div className="space-y-3">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-smooth space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm leading-snug">
                          {module.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {module.description}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => navigate(`/groups/${id}/modules/add`)}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => alert("تم حذف الوحدة")}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* سجل الحضور */}
        <div>
          <h2 className="text-4xl font-bold text-center mb-10 text-gradient-gold">
            سجل الحضور في آخر الجلسات
          </h2>
          <Card className="glass-card overflow-hidden card-glow border-[var(--gold)]/30">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary/10 to-[var(--gold)]/10">
                  <tr>
                    <th className="text-right p-6 text-xl font-bold">التاريخ</th>
                    <th className="text-center p-6 text-xl font-bold">الحاضرون</th>
                    <th className="text-center p-6 text-xl font-bold">المتأخرون</th>
                    <th className="text-center p-6 text-xl font-bold">الغائبون</th>
                    <th className="text-center p-6 text-xl font-bold">النسبة</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSessions.map((s, i) => {
                    const ratio = Math.round((s.present + s.late) / students.length * 100);
                    return (
                      <tr key={i} className="border-b border-border/20 hover:bg-primary/5">
                        <td className="p-6 text-lg text-right font-medium">{s.date}</td>
                        <td className="p-6 text-center"><Badge className="bg-green-100 text-green-700">{s.present}</Badge></td>
                        <td className="p-6 text-center"><Badge className="bg-amber-100 text-amber-700">{s.late}</Badge></td>
                        <td className="p-6 text-center"><Badge className="bg-red-100 text-red-700">{s.absent}</Badge></td>
                        <td className="p-6 text-center">
                          <span className={`text-2xl font-bold ${ratio >= 90 ? "text-green-600" : ratio >= 70 ? "text-amber-600" : "text-red-600"}`}>
                            {ratio}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* آية في الأسفل */}
        <div className="text-center py-12">
          <div className="w-full h-2 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-70 my-8" />
          <p className="text-3xl font-amiri italic text-gradient-royal leading-relaxed">
            "وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ"
          </p>
          <p className="text-muted-foreground mt-4">سورة الذاريات</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GroupDetails;