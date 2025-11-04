import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const EditGroup = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "مجموعة الفرقان",
    teacher: "أحمد محمود",
    time: "السبت - الخميس",
    price: "5.00 ر.س",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "تم تحديث المجموعة",
      description: "تم تحديث بيانات المجموعة بنجاح",
    });
    navigate(`/groups/${id}`);
  };

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

        <div className="bg-card rounded-xl border border-border p-8">
          <h1 className="text-3xl font-bold mb-6">تعديل المجموعة</h1>

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
                value={formData.teacher}
                onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">وقت الحلقة</Label>
              <Input
                id="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">السعر</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                حفظ التعديلات
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditGroup;
