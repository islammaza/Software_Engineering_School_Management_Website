import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Users, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Groups = () => {
  const navigate = useNavigate();
  const [groups] = useState([
    {
      id: 1,
      name: "مجموعة الفرقان",
      teacher: "أحمد محمود",
      students: 12,
      time: "السبت - الخميس",
    },
    {
      id: 2,
      name: "مجموعة النور",
      teacher: "محمد القرشي",
      students: 15,
      time: "الأحد - الأربعاء",
    },
    {
      id: 3,
      name: "مجموعة الإحسان",
      teacher: "علي حسن",
      students: 10,
      time: "السبت - الثلاثاء",
    },
    {
      id: 4,
      name: "مجموعة النهدي",
      teacher: "يوسف بن علي",
      students: 14,
      time: "الأحد - الخميس",
    },
  ]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">المجموعات</h1>
            <p className="text-muted-foreground">إدارة حلقات ومجموعات القرآن الكريم</p>
          </div>
          <Button 
            className="flex items-center gap-2"
            onClick={() => navigate("/groups/add")}
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مجموعة جديدة</span>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Link
              key={group.id}
              to={`/groups/${group.id}`}
              className="block bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-smooth"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">{group.name}</h3>
                  <p className="text-sm text-muted-foreground">{group.teacher}</p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{group.time}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-medium">{group.students} طالب</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Groups;
