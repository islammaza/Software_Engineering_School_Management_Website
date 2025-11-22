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
      <div className="space-y-8 md:space-y-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-black text-gradient-durar mb-4 md:mb-6">
            الحلقات والمجموعات
          </h1>
          <p className="text-base md:text-2xl text-muted-foreground font-medium">إدارة حلقات تحفيظ القرآن الكريم</p>
          <div className="w-full h-2 md:h-3 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-80 my-8 md:my-12" />
        </div>

        <div className="flex justify-end">
          <Button size="lg" className="bg-gradient-to-r from-primary to-[var(--gold)] text-white text-sm md:text-xl px-6 md:px-10 py-4 md:py-7 shadow-xl w-full md:w-auto" onClick={() => navigate("/groups/add")}>
            <Plus className="w-5 h-5 md:w-6 md:h-6 ml-2 md:ml-3" />
            إضافة مجموعة جديدة
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-10">
          {groups.map((group) => (
            <div
              key={group.id}
              onClick={() => navigate(`/groups/${group.id}`)}
              className="group cursor-pointer glass-card rounded-3xl p-6 md:p-10 border border-[var(--gold)]/30 card-glow hover:scale-102 transition-all duration-300 text-center"
            >
              <Users className="w-16 md:w-20 h-16 md:h-20 mx-auto mb-4 md:mb-6 text-primary group-hover:scale-105 transition-all" />
              <h3 className="text-2xl md:text-3xl font-black text-gradient-durar mb-3 md:mb-4">{group.name}</h3>
              <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8">{group.teacher}</p>
              <div className="space-y-3 md:space-y-4">
                <p className="text-sm md:text-lg flex items-center justify-center gap-2 md:gap-3">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-[var(--gold)]" />
                  <span className="font-bold">{group.time}</span>
                </p>
                <p className="text-lg md:text-2xl font-bold text-primary pt-4 md:pt-6 border-t border-border/30">
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