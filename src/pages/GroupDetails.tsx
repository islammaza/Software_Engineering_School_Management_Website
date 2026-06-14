// src/pages/GroupDetails.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
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
import { useToast } from "@/hooks/use-toast";
import { getGroupById, deleteGroup } from "@/lib/api/groups";
import { getModulesByGroup, deleteModuleById } from "@/lib/api/modules";
import { getStudentsByGroup, deleteStudentById } from "@/lib/api/students";

const GroupDetails = () => {
  const { id } = useParams(); // group id
  const navigate = useNavigate();
  const { toast } = useToast();

  const [students, setStudents] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [group, setGroup] = useState<any>({ name: "", teacher_name: "" });
  const [deleteStudentId, setDeleteStudentId] = useState<number | null>(null);
  const [deleteModuleId, setDeleteModuleId] = useState<number | null>(null);
  const [deleteGroupOpen, setDeleteGroupOpen] = useState(false);

  // Fetch group, students, modules on mount
  useEffect(() => {
    if (!id) return;

    const fetchGroupDetails = async () => {
      try {
        // Fetch group info
        const groupData = await getGroupById(id);
        setGroup(groupData);

        // Fetch students
        const { data: studentsData, error: studentsError } =
          await getStudentsByGroup(Number(id));

        if (studentsError) {
          toast({
            title: "خطأ",
            description: studentsError.message,
            variant: "destructive",
          });
        } else {
          setStudents(studentsData || []);
        }

        // Fetch modules
        const { data: modulesData, error: modulesError } =
          await getModulesByGroup(Number(id));

        if (modulesError) {
          toast({
            title: "خطأ",
            description: modulesError.message,
            variant: "destructive",
          });
        } else {
          setModules(modulesData || []);
        }
      } catch (error) {
        toast({
          title: "خطأ",
          description: "فشل في جلب بيانات المجموعة",
          variant: "destructive",
        });
      }
    };

    fetchGroupDetails();
  }, [id, toast]);

  // Delete student
  const handleDeleteStudent = async () => {
    if (!deleteStudentId) return;

    const { error } = await deleteStudentById(deleteStudentId);

    if (error) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setStudents((prev) => prev.filter((s) => s.id !== deleteStudentId));
    toast({ title: "تم الحذف", description: "تم حذف الطالب بنجاح" });
    setDeleteStudentId(null);
  };

  // Delete module
  const handleDeleteModule = async () => {
    if (!deleteModuleId) return;

    const { error } = await deleteModuleById(deleteModuleId.toString());

    if (error) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setModules((prev) => prev.filter((m) => m.id !== deleteModuleId));
    toast({ title: "تم الحذف", description: "تم حذف الوحدة بنجاح" });
    setDeleteModuleId(null);
  };


  const handleDeleteGroup = async () => {
    if (!id) return;
    try {
      await deleteGroup(id);
      setDeleteGroupOpen(false);
      toast({ 
        title: "تم الحذف", 
        description: "تم حذف المجموعة بنجاح" 
      });
      navigate("/groups");
    } catch (error: any) {
      console.error("Failed to delete group:", error);
      const errorMessage = error?.message || "فشل في حذف المجموعة";
      setDeleteGroupOpen(false);
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-12 py-12 px-4 sm:px-6 lg:px-8">
        {/* Back button */}
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

        {/* Group title */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-gradient-durar mb-3">
            {group.name}
          </h1>
          <p className="text-lg sm:text-xl text-[var(--gold)] font-bold">
            المعلم: {group.teacher_name}
          </p>
          <div className="w-full h-2 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-80 my-8" />
        </div>

        {/* Actions */}
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
          <Button
            size="lg"
            variant="destructive"
            onClick={() => setDeleteGroupOpen(true)}
          >
            <Trash2 className="w-5 h-5 ml-2" />
            حذف المجموعة
          </Button>
        </div>

        {/* Students list */}
        <div>
          <h2 className="text-2xl font-black text-center mb-6 text-gradient-durar">
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
                        {student.full_name}
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

        {/* Modules list */}
        <div>
          <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-black text-gradient-durar">
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
                      {module.name}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/groups/${id}/modules/${module.id}/edit`);
                      }}
                    >
                      <Edit className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent navigating
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

        {/* Delete student dialog */}
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

        {/* Delete module dialog */}
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

        {/* Delete group dialog */}
        <AlertDialog
          open={deleteGroupOpen}
          onOpenChange={setDeleteGroupOpen}
        >
          <AlertDialogContent className="bg-white border-2 border-destructive/50 rounded-2xl shadow-2xl max-w-md mx-auto">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-black text-black text-right">
                هل أنت متأكد من حذف هذه المجموعة؟
              </AlertDialogTitle>
              <AlertDialogDescription className="text-lg text-gray-800 text-right leading-relaxed">
                هذا الإجراء{" "}
                <span className="font-bold text-destructive">
                  لا يمكن التراجع عنه
                </span>
                . سيتم حذف المجموعة نهائيًا مع جميع الطلاب والوحدات المرتبطة بها.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex gap-4 justify-end mt-6">
              <AlertDialogCancel className="text-lg px-10 py-6 border-2 border-gray-400 hover:bg-gray-100 font-bold">
                إلغاء
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteGroup}
                className="bg-red-600 hover:bg-red-700 text-white text-lg font-bold px-12 py-6 shadow-xl"
              >
                نعم، احذف المجموعة
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default GroupDetails;
