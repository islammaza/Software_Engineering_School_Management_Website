import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { getGroupById, updateGroup, deleteGroup } from "@/lib/api/groups";

interface GroupForm {
  name: string;
  teacher_name: string;
  timing: string;
}

const EditGroup = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [formData, setFormData] = useState<GroupForm>({
    name: "",
    teacher_name: "",
    timing: "",
  });
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadGroup() {
      setLoading(true);
      try {
        const data = await getGroupById(id);
        setFormData({
          name: data.name,
          teacher_name: data.teacher_name,
          timing: data.timing,
        });
      } catch (error) {
        console.error("Failed to fetch group:", error);
        toast({ 
          title: "خطأ", 
          description: "فشل في جلب بيانات المجموعة",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    loadGroup();
  }, [id, toast]);

  // Update group
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await updateGroup(id, {
        name: formData.name,
        teacher_name: formData.teacher_name,
        timing: formData.timing,
      });
      toast({ 
        title: "تم التحديث", 
        description: "تم تحديث بيانات المجموعة بنجاح" 
      });
      navigate(`/groups/${id}`);
    } catch (error) {
      console.error("Failed to update group:", error);
      toast({ 
        title: "خطأ", 
        description: "فشل في تحديث بيانات المجموعة",
        variant: "destructive"
      });
    }
  };

  // Delete group
  const handleDeleteGroup = async () => {
    if (!id) return;
    try {
      await deleteGroup(id);
      setDeleteOpen(false);
      toast({ 
        title: "تم الحذف", 
        description: "تم حذف المجموعة بنجاح" 
      });
      navigate("/groups");
    } catch (error: any) {
      console.error("Failed to delete group:", error);
      const errorMessage = error?.message || "فشل في حذف المجموعة";
      setDeleteOpen(false);
      toast({ 
        title: "خطأ", 
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">يتم تحميل بيانات المجموعة...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(`/groups/${id}`)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          <span>رجوع</span>
        </Button>

        <div className="bg-card rounded-xl border border-border p-8 space-y-6">
          <h1 className="text-3xl font-bold">تعديل المجموعة</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">اسم المجموعة</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacher">اسم المعلم</Label>
              <Input
                id="teacher"
                value={formData.teacher_name}
                onChange={(e) => setFormData({ ...formData, teacher_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">وقت الحلقة</Label>
              <Input
                id="time"
                value={formData.timing}
                onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">حفظ التعديلات</Button>
              <Button type="button" variant="outline" onClick={() => navigate(`/groups/${id}`)} className="flex-1">إلغاء</Button>
            </div>
          </form>

          {/* Delete button */}
          <div className="pt-6">
            <Button
              type="button"
              variant="destructive"
              className="w-full flex justify-center gap-2"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="w-5 h-5" />
              حذف المجموعة
            </Button>
          </div>

          {/* Delete confirmation */}
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogContent className="bg-white border-2 border-destructive/50 rounded-2xl shadow-2xl max-w-md mx-auto">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-black text-black text-right">
                  هل أنت متأكد من حذف هذه المجموعة؟
                </AlertDialogTitle>
                <AlertDialogDescription className="text-lg text-gray-800 text-right leading-relaxed">
                  هذا الإجراء <span className="font-bold text-destructive">لا يمكن التراجع عنه</span> وسيؤدي إلى حذف كل البيانات المتعلقة بهذه المجموعة.
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
      </div>
    </div>
  );
};

export default EditGroup;
