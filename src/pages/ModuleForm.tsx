import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

const ModuleForm = () => {
  const { id, moduleId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!moduleId;

  const [formData, setFormData] = useState({
    title: isEditMode ? "سورة البقرة" : "",
    description: isEditMode ? "حفظ جزء" : "",
    order: isEditMode ? "1" : "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: isEditMode ? "تم التحديث" : "تمت الإضافة",
      description: isEditMode
        ? "تم تحديث الوحدة بنجاح"
        : "تمت إضافة الوحدة بنجاح",
    });
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
                <h1 className="text-2xl sm:text-3xl font-bold">
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
              <Button type="submit" className="flex-1">
                {isEditMode ? "تحديث الوحدة" : "إضافة الوحدة"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/groups/${id}`)}
                className="flex-1"
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
