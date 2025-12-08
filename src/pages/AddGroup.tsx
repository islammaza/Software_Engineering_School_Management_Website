import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import * as GroupsAPI from "@/lib/api/groups";
import { requireAuth } from "@/lib/auth";

const AddGroup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<{
    name: string;
    teacher_name: string;
    timing: string;
  }>({
    name: "",
    teacher_name: "",
    timing: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const schoolId = requireAuth(navigate);
    if (!schoolId) return;

    try {
      await GroupsAPI.addGroup({
        name: formData.name,
        teacher_name: formData.teacher_name,
        timing: formData.timing,
        school_id: schoolId,
      });

      toast({
        title: "تم إضافة المجموعة",
        description: "تمت إضافة المجموعة بنجاح",
      });

      navigate("/groups");
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الإضافة",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/groups")}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          <span>رجوع</span>
        </Button>

        <div className="bg-card rounded-xl border border-border p-8">
          <h1 className="text-3xl font-bold mb-6">إضافة مجموعة جديدة</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Group Name */}
            <div className="space-y-2">
              <Label htmlFor="name">اسم المجموعة</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="مثال: مجموعة الفرقان"
                required
              />
            </div>

            {/* Teacher Name */}
            <div className="space-y-2">
              <Label htmlFor="teacher_name">اسم المعلم</Label>
              <Input
                id="teacher_name"
                value={formData.teacher_name}
                onChange={(e) =>
                  setFormData({ ...formData, teacher_name: e.target.value })
                }
                placeholder="مثال: أحمد محمود"
                required
              />
            </div>

            {/* Timing */}
            <div className="space-y-2">
              <Label htmlFor="timing">وقت الحلقة</Label>
              <Input
                id="timing"
                value={formData.timing}
                onChange={(e) =>
                  setFormData({ ...formData, timing: e.target.value })
                }
                placeholder="مثال: السبت - الخميس"
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                حفظ
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/groups")}
                className="flex-1"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddGroup;
