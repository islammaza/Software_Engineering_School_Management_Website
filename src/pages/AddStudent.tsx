import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const AddStudent = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    status: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "تم إضافة الطالب",
      description: "تمت إضافة الطالب بنجاح",
    });
    navigate(`/groups/${groupId}`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(`/groups/${groupId}`)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          <span>رجوع</span>
        </Button>

        <div className="bg-card rounded-xl border border-border p-8">
          <h1 className="text-3xl font-bold mb-6">إضافة طالب جديد</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">اسم الطالب</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="مثال: عبد الرحمن بن صالح"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">المستوى</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المستوى" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ممتاز">ممتاز</SelectItem>
                  <SelectItem value="جيد جداً">جيد جداً</SelectItem>
                  <SelectItem value="جيد">جيد</SelectItem>
                  <SelectItem value="مقبول">مقبول</SelectItem>
                  <SelectItem value="ضعيف">ضعيف</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                حفظ
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/groups/${groupId}`)}
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

export default AddStudent;
