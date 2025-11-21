// src/pages/StudentDetails.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const StudentDetails = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const { toast } = useToast();

  const student = {
    name: "عبد الرحمن بن صالح",
    group: "مجموعة الفرقان",
    attendanceRate: "100%",
    average: 94,
    progress: [
      { unit: "سورة البقرة", completed: "3/5 أجزاء", percent: 60 },
      { unit: "التجويد", completed: "ممتاز", percent: 90 },
      { unit: "سورة آل عمران", completed: "2/8 أجزاء", percent: 25 },
    ],
  };

  const handleExportPDF = () => {
    toast({ title: "جاري التصدير...", description: "تقرير الطالب يتم إعداده" });
  };

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-lg z-50 flex items-center justify-center p-6 overflow-y-auto">
      <div className="bg-card/95 glass-card rounded-3xl border border-[var(--gold)]/40 shadow-2xl max-w-5xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-border bg-gradient-to-r from-primary/5 to-[var(--gold)]/5">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/groups/${groupId}`)} className="rounded-full hover:bg-destructive/10">
            <X className="w-6 h-6" />
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gradient-royal">{student.name}</h1>
            <p className="text-xl text-[var(--gold)] mt-2">{student.group}</p>
          </div>
          <div className="w-12" />
        </div>

        {/* Content */}
        <div className="p-10 space-y-12">
          <div className="text-center">
            <p className="text-6xl font-bold text-primary">{student.average}%</p>
            <p className="text-2xl text-muted-foreground">المتوسط العام للحفظ</p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient-gold">تقدم الحفظ</h2>
            <div className="space-y-6">
              {student.progress.map((item, i) => (
                <div key={i} className="glass-card p-6 rounded-2xl border border-primary/20">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">{item.unit}</h3>
                    <span className="text-xl font-bold text-[var(--gold)]">{item.completed}</span>
                  </div>
                  <Progress value={item.percent} className="h-8">
                    <div className="h-full bg-gradient-to-r from-primary to-[var(--gold)] flex items-center justify-center text-white text-lg font-bold">
                      {item.percent}%
                    </div>
                  </Progress>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-6">
            <Button size="lg" onClick={handleExportPDF} className="bg-gradient-to-r from-primary to-[var(--gold)] text-white px-12 py-8 text-xl">
              <FileDown className="w-6 h-6 ml-3" />
              تصدير PDF
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate(-1)} className="border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black px-12 py-8 text-xl">
              رجوع
            </Button>
          </div>

          <div className="text-center py-12 border-t-2 border-[var(--gold)]/30">
            <div className="w-full h-3 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-80 my-12" />
            <p className="text-4xl font-amiri italic text-gradient-royal leading-relaxed">
              "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ"
            </p>
            <p className="text-muted-foreground mt-4">سورة العلق - الآية 1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;