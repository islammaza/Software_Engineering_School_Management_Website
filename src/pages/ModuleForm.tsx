import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { getModuleById, addModule, updateModule } from "@/lib/api/modules";

const ModuleForm = () => {
  const { id, moduleId } = useParams(); // id = groupId
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!moduleId;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [originalName, setOriginalName] = useState("");

  // Fetch module data if editing
  useEffect(() => {
    if (isEditMode && moduleId) {
      const fetchModule = async () => {
        const { data, error } = await getModuleById(moduleId);
        if (error) {
          toast({
            title: "خطأ",
            description: "فشل تحميل بيانات الوحدة",
            variant: "destructive",
          });
          return;
        }
        if (data) {
          setFormData({
            title: data.name,
            description: data.description || "",
          });
          setOriginalName(data.name);
        }
      };
      fetchModule();
    }
  }, [isEditMode, moduleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      toast({
        title: "خطأ",
        description: "معرف المجموعة مفقود",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    if (isEditMode && moduleId) {
      // Update module
      const { error } = await updateModule(
        moduleId,
        {
          name: formData.title,
          description: formData.description,
          group_id: Number(id),
        },
        {
          checkDuplicates: true,
          originalData: { name: originalName },
        }
      );

      if (error) {
        toast({
          title: "خطأ",
          description: error.message || "فشل تحديث الوحدة",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      toast({
        title: "تم التحديث",
        description: "تم تحديث الوحدة بنجاح",
      });
    } else {
      // Add new module
      const { error } = await addModule({
        name: formData.title,
        description: formData.description,
        group_id: Number(id),
      });

      if (error) {
        toast({
          title: "خطأ",
          description: error.message || "فشل إضافة الوحدة",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      toast({
        title: "تمت الإضافة",
        description: "تمت إضافة الوحدة بنجاح",
      });
    }

    setLoading(false);
    navigate(`/groups/${id}`);
  };

  return (
    <DashboardLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          <div className="bg-card rounded-xl border border-border p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/groups/${id}`)}
                className="rounded-full"
                aria-label="العودة للمجموعة"
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold">
                  {isEditMode ? "تعديل الوحدة" : "إضافة وحدة جديدة"}
                </h1>
                <p className="text-muted-foreground">
                  {isEditMode ? "تحديث" : "إضافة"} وحدة للمجموعة
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">عنوان الوحدة</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="مثال: سورة البقرة"
                required
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="مثال: حفظ جزء"
                className="text-right min-h-[100px]"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading
                  ? "جاري الحفظ..."
                  : isEditMode
                  ? "تحديث الوحدة"
                  : "إضافة الوحدة"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/groups/${id}`)}
                className="flex-1"
                disabled={loading}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ModuleForm;
