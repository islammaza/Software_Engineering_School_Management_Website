import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const group = {
    id,
    name: "مجموعة الفرقان",
    teacher: "أحمد محمود",
  };

  const students = [
    {
      id: 1,
      name: "عبد الرحمن بن صالح",
      status: "ممتاز",
      statusColor: "bg-green-500",
      progress: [
        { unit: "سورة البقرة", progress: "3/5 جزء", date: "2023-10-27", notes: "أداء جيد يحتاج لمراجعة المتشابهات" },
        { unit: "التجويد", progress: "85/100", date: "2023-10-25", notes: "ممتاز في أحكام النون الساكنة" },
      ],
    },
    {
      id: 2,
      name: "يوسف بن علي",
      status: "جيد جداً",
      statusColor: "bg-blue-500",
      progress: [
        { unit: "سورة آل عمران", progress: "1/2 جزء", date: "2023-11-05", notes: "يحتاج مراجعة" },
      ],
    },
    {
      id: 3,
      name: "خالد بن أحمد",
      status: "ممتاز",
      statusColor: "bg-green-500",
      progress: [],
    },
    {
      id: 4,
      name: "سليمان القريشي",
      status: "جيد",
      statusColor: "bg-yellow-500",
      progress: [],
    },
    {
      id: 5,
      name: "عمر بن الخطاب",
      status: "ضعيف",
      statusColor: "bg-red-500",
      progress: [],
    },
  ];

  const handleDeleteStudent = (studentId: number) => {
    toast({
      title: "تم الحذف",
      description: "تم حذف الطالب بنجاح",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
            <p className="text-muted-foreground">{group.teacher}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate(`/groups/${id}/edit`)}
            >
              <Edit className="w-4 h-4" />
              <span>تعديل</span>
            </Button>
            <Button 
              className="flex items-center gap-2"
              onClick={() => navigate(`/groups/${id}/students/add`)}
            >
              <Plus className="w-4 h-4" />
              <span>إضافة طالب</span>
            </Button>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium border-b border-border">
            <div className="col-span-4">الاسم الكامل</div>
            <div className="col-span-3">المستوى</div>
            <div className="col-span-3 text-center">التفاصيل</div>
            <div className="col-span-2 text-center">الإجراءات</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {students.map((student) => (
              <div key={student.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/30 transition-smooth">
                <div className="col-span-4 font-medium">{student.name}</div>
                <div className="col-span-3">
                  <Badge className={`${student.statusColor} text-white`}>
                    {student.status}
                  </Badge>
                </div>
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
                    onClick={() => handleDeleteStudent(student.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GroupDetails;