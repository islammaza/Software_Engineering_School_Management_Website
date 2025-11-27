// src/pages/GroupDetails.tsx
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Edit, Trash2, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const group = { id, name: "مجموعة الفرقان", teacher: "أحمد محمود" };

  const [students, setStudents] = useState([
    { id: 1, name: "عبد الرحمن بن صالح" },
    { id: 2, name: "فاطمة الزهراء" },
    { id: 3, name: "يوسف بن علي" },
    { id: 4, name: "خديجة بنت محمد" },
    { id: 5, name: "عمر بن الخطاب" },
  ]);

  const [modules, setModules] = useState([
    { id: 1, title: "سورة البقرة", description: "حفظ من الآية 1 إلى 141" },
    { id: 2, title: "التجويد", description: "أحكام النون والميم والمدود" },
    { id: 3, title: "مراجعة الجزء 30", description: "مراجعة كاملة مع التجويد" },
    { id: 4, title: "آداب طالب العلم", description: "دروس تربوية أسبوعية" },
  ]);

  // حالة نافذة التأكيد
  const [deleteStudentId, setDeleteStudentId] = useState<number | null>(null);
  const [deleteModuleId, setDeleteModuleId] = useState<number | null>(null);

  const handleDeleteStudent = () => {
    if (deleteStudentId !== null) {
      setStudents(students.filter((s) => s.id !== deleteStudentId));
      toast({ title: "تم الحذف", description: "تم حذف الطالب بنجاح" });
      setDeleteStudentId(null);
    }
  };

  const handleDeleteModule = () => {
    if (deleteModuleId !== null) {
      setModules(modules.filter((m) => m.id !== deleteModuleId));
      toast({ title: "تم الحذف", description: "تم حذف الوحدة بنجاح" });
      setDeleteModuleId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-12 py-12 px-4 sm:px-6 lg:px-8">
        {/* زر الرجوع */}
        <div className="max-w-7xl mx-auto">
          <Button
            onClick={() => navigate("/groups")}
            variant="outline"
            size="lg"
            className="mb-8 border-primary text-primary hover:bg-primary hover:text-white text-lg px-10 py-6 shadow-lg"
          >
            <ArrowLeft className="w-6 h-6 ml-3" />
            رجوع إلى قائمة الحلقات
          </Button>
        </div>

        {/* عنوان المجموعة */}
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-black text-gradient-durar mb-4">
            {group.name}
          </h1>
          <p className="text-2xl sm:text-3xl text-[var(--gold)] font-bold">
            المعلم: {group.teacher}
          </p>
          <div className="w-full h-3 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-80 my-12" />
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            onClick={() => navigate(`/groups/${id}/students/add`)}
          >
            <Plus className="w-5 h-5 ml-2" />
            إضافة طالب
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate(`/groups/${id}/edit`)}
            className="border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black"
          >
            <Edit className="w-5 h-5 ml-2" />
            تعديل المجموعة
          </Button>
        </div>

        {/* قائمة الطلاب */}
        <div>
          <h2 className="text-4xl font-black text-center mb-8 text-gradient-durar">
            الطلاب
          </h2>
          <div className="bg-card rounded-3xl border border-border/50 shadow-2xl overflow-hidden">
            <div className="hidden lg:grid grid-cols-12 gap-4 p-6 bg-primary/5 font-bold text-lg border-b border-border">
              <div className="col-span-5 text-right">الاسم الكامل</div>
              <div className="col-span-3 text-center">تفاصيل</div>
              <div className="col-span-4 text-center">الإجراءات</div>
            </div>

            <div className="divide-y divide-border/30">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="p-6 hover:bg-primary/5 transition-all"
                >
                  <div className="lg:grid lg:grid-cols-12 gap-4 items-center">
                    <div className="lg:col-span-5">
                      <p className="text-xl font-bold text-right">
                        {student.name}
                      </p>
                    </div>

                    <div className="lg:col-span-3 text-center mt-4 lg:mt-0">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-primary to-[var(--gold)] text-white hover:shadow-lg"
                        onClick={() =>
                          navigate(`/groups/${id}/students/${student.id}`)
                        }
                      >
                        <FileText className="w-4 h-4 ml-2" />
                        تقرير الطالب
                      </Button>
                    </div>

                    <div className="lg:col-span-4 flex justify-center gap-3 mt-4 lg:mt-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:text-primary"
                        onClick={() =>
                          navigate(`/groups/${id}/students/${student.id}/edit`)
                        }
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:text-destructive"
                        onClick={() => setDeleteStudentId(student.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* قائمة الوحدات */}
        <div>
          <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
            <h2 className="text-4xl font-black text-gradient-durar">
              الوحدات الدراسية
            </h2>
            <Button
              size="lg"
              onClick={() => navigate(`/groups/${id}/modules/add`)}
            >
              <Plus className="w-5 h-5 ml-2" />
              إضافة وحدة
            </Button>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {modules.map((module) => (
              <Card
                key={module.id}
                className="glass-card p-8 cursor-pointer hover:scale-105 transition-all border-2 border-primary/20"
                onClick={() => navigate(`/groups/${id}/modules/${module.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <h3 className="text-2xl font-black text-primary">
                      {module.title}
                    </h3>
                    <p className="text-lg text-muted-foreground mt-2">
                      {module.description}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:text-primary"
                    >
                      <Edit className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation(); // منع الانتقال لصفحة الوحدة
                        setDeleteModuleId(module.id);
                      }}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* نافذة تأكيد حذف الطالب – نص أسود واضح + زر أحمر قوي */}
        <AlertDialog
          open={deleteStudentId !== null}
          onOpenChange={() => setDeleteStudentId(null)}
        >
          <AlertDialogContent className="bg-white border-2 border-destructive/50 rounded-2xl shadow-2xl max-w-md mx-auto">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-black text-black text-right">
                هل أنت متأكد من حذف هذا الطالب؟
              </AlertDialogTitle>
              <AlertDialogDescription className="text-lg text-gray-800 text-right leading-relaxed">
                هذا الإجراء{" "}
                <span className="font-bold text-destructive">
                  لا يمكن التراجع عنه
                </span>
                . سيتم حذف الطالب نهائيًا من النظام مع كل بياناته.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex gap-4 justify-end mt-6">
              <AlertDialogCancel className="text-lg px-10 py-6 border-2 border-gray-400 hover:bg-gray-100 font-bold">
                إلغاء
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteStudent}
                className="bg-red-600 hover:bg-red-700 text-white text-lg font-bold px-12 py-6 shadow-xl"
              >
                نعم، احذف الطالب
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* نافذة تأكيد حذف الوحدة – نفس الستايل */}
        <AlertDialog
          open={deleteModuleId !== null}
          onOpenChange={() => setDeleteModuleId(null)}
        >
          <AlertDialogContent className="bg-white border-2 border-destructive/50 rounded-2xl shadow-2xl max-w-md mx-auto">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-black text-black text-right">
                هل أنت متأكد من حذف هذه الوحدة؟
              </AlertDialogTitle>
              <AlertDialogDescription className="text-lg text-gray-800 text-right leading-relaxed">
                سيتم حذف الوحدة و
                <span className="font-bold text-destructive">
                  جميع تقييمات الطلاب
                </span>{" "}
                فيها نهائيًا.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex gap-4 justify-end mt-6">
              <AlertDialogCancel className="text-lg px-10 py-6 border-2 border-gray-400 hover:bg-gray-100 font-bold">
                إلغاء
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteModule}
                className="bg-red-600 hover:bg-red-700 text-white text-lg font-bold px-12 py-6 shadow-xl"
              >
                نعم، احذف الوحدة
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/* آية */}
        <div className="text-center py-20">
          <div className="w-full h-3 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-80 my-12 max-w-4xl mx-auto" />
          <p className="text-5xl font-amiri italic text-gradient-durar leading-relaxed max-w-5xl mx-auto">
            "وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ"
          </p>
          <p className="text-2xl text-muted-foreground mt-8">سورة الذاريات</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GroupDetails;
