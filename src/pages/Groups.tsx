// src/pages/Groups.tsx
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Users, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Groups = () => {
  const navigate = useNavigate();

  const groups = [
    { id: 1, name: "مجموعة الفرقان", teacher: "أحمد محمود", students: 12, time: "السبت - الخميس" },
    { id: 2, name: "مجموعة النور", teacher: "محمد القرشي", students: 15, time: "الأحد - الأربعاء" },
    { id: 3, name: "مجموعة الإحسان", teacher: "علي حسن", students: 10, time: "السبت - الثلاثاء" },
    { id: 4, name: "مجموعة النهدي", teacher: "يوسف بن علي", students: 14, time: "الأحد - الخميس" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-12">
        <div className="text-center">
          <h1 className="text-6xl font-black text-gradient-durar mb-6">
            الحلقات والمجموعات
          </h1>
          <p className="text-2xl text-muted-foreground font-medium">إدارة حلقات تحفيظ القرآن الكريم</p>
          <div className="w-full h-3 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-80 my-12" />
        </div>

        <div className="flex justify-end">
          <Button size="lg" className="bg-gradient-to-r from-primary to-[var(--gold)] text-white text-xl px-10 py-7 shadow-xl" onClick={() => navigate("/groups/add")}>
            <Plus className="w-6 h-6 ml-3" />
            إضافة مجموعة جديدة
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {groups.map((group) => (
            <div
              key={group.id}
              onClick={() => navigate(`/groups/${group.id}`)}
              className="group cursor-pointer glass-card rounded-3xl p-10 border border-[var(--gold)]/30 card-glow hover:scale-105 hover:shadow-2xl transition-all duration-500 text-center"
            >
              <Users className="w-20 h-20 mx-auto mb-6 text-primary group-hover:scale-110 transition-all" />
              <h3 className="text-3xl font-black text-gradient-durar mb-4">{group.name}</h3>
              <p className="text-xl text-muted-foreground mb-8">{group.teacher}</p>
              <div className="space-y-4">
                <p className="text-lg flex items-center justify-center gap-3">
                  <Clock className="w-6 h-6 text-[var(--gold)]" />
                  <span className="font-bold">{group.time}</span>
                </p>
                <p className="text-2xl font-bold text-primary pt-6 border-t border-border/30">
                  {group.students} طالب
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Groups;