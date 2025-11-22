// src/pages/Dashboard.tsx
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Users, BookOpen, TrendingUp, Award, Sparkles, Calendar, FileCheck2, Trophy, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const IslamicOrnament = () => (
  <div className="w-full h-3 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-80 my-12" />
);

const Dashboard = () => {
  const navigate = useNavigate();

  // التاريخ الميلادي والهجري (محدث تلقائيًا)
  const today = new Date().toLocaleDateString("ar-EG", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const hijriDate = "21 جمادى الأولى 1447 هـ"; // يمكن ربطه بمكتبة hijri-converter لاحقًا

  const stats = [
    { icon: Users, label: "إجمالي الطلاب", value: "87", change: "+12%", color: "text-primary" },
    { icon: BookOpen, label: "الحلقات النشطة", value: "12", change: "+3", color: "text-[var(--gold)]" },
    { icon: TrendingUp, label: "معدل الحفظ الشهري", value: "4.8 أجزاء", change: "+18%", color: "text-green-600" },
    { icon: Award, label: "المتميزون هذا الشهر", value: "23", change: "+5", color: "text-purple-600" },
  ];

  const topMemorizers = [
    { rank: 1, name: "فاطمة الزهراء", group: "النور", progress: 100, reward: "طالبة الشهر" },
    { rank: 2, name: "عبد الرحمن بن صالح", group: "الفرقان", progress: 97 },
    { rank: 3, name: "عمر بن الخطاب", group: "الإحسان", progress: 94 },
  ];

  const needsAttention = [
    { name: "سليمان القريشي", attendance: "65%" },
    { name: "أحمد محمد", attendance: "70%" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 md:space-y-12 pb-16">

        {/* الترحيب + التاريخ + آية */}
        <div className="text-center pt-4 md:pt-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gradient-durar mb-4 md:mb-6">
            مرحباً بك في دار القرآن
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-base md:text-2xl text-muted-foreground mb-4">
            <Calendar className="w-5 h-5 md:w-8 md:h-8 text-[var(--gold)]" />
            <span className="font-bold text-sm md:text-lg">{today}</span>
            <span className="text-[var(--gold)] font-bold text-xs md:text-base">| {hijriDate}</span>
          </div>
          <IslamicOrnament />
          <p className="text-xl md:text-4xl font-amiri italic text-gradient-royal leading-relaxed max-w-5xl mx-auto px-2">
            "وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا ۝ وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ"
          </p>
          <p className="text-sm md:text-xl text-muted-foreground mt-2 md:mt-4">سورة الطلاق • الآيتان 2-3</p>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, i) => (
            <Card key={i} className="glass-card p-4 md:p-8 card-glow">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <stat.icon className={`w-10 md:w-14 h-10 md:h-14 ${stat.color}`} />
                <Badge className="text-xs md:text-lg font-bold bg-green-100 text-green-700 animate-pulse">
                  {stat.change}
                </Badge>
              </div>
              <p className="text-3xl md:text-5xl font-black text-foreground">{stat.value}</p>
              <p className="text-base md:text-xl text-muted-foreground mt-2 md:mt-3">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* أبطال الحفظ */}
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-center mb-6 md:mb-12 text-gradient-durar">
            أبطال الحفظ هذا الشهر
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {topMemorizers.map((student, i) => (
              <Card
                key={i}
                className={`glass-card p-6 md:p-10 text-center card-glow hover:scale-102 transition-all duration-300 relative overflow-hidden ${
                  i === 0 ? "border-4 border-[var(--gold)] royal-glow" : "border border-border/50"
                }`}
              >
                {i === 0 && (
                  <div className="absolute -top-6 -right-6">
                    <Trophy className="w-16 md:w-24 h-16 md:h-24 text-[var(--gold)] animate-pulse" />
                  </div>
                )}
                <div className="w-20 h-20 md:w-28 md:h-28 mx-auto rounded-full bg-gradient-to-br from-primary to-[var(--gold)] flex items-center justify-center mb-4 md:mb-6 shadow-2xl flex-shrink-0">
                  <Sparkles className="w-10 h-10 md:w-16 md:h-16 text-white" />
                </div>
                <h3 className="text-xl md:text-3xl font-black mb-2 md:mb-3">{student.name}</h3>
                <p className="text-base md:text-xl text-muted-foreground mb-4 md:mb-6">{student.group}</p>
                <Progress value={student.progress} className="h-8 md:h-16 mb-4 md:mb-6">
                  <div className="h-full bg-gradient-to-r from-primary to-[var(--gold)] rounded-full flex items-center justify-center text-white text-sm md:text-2xl font-black">
                    {student.progress}%
                  </div>
                </Progress>
                {student.reward && <Badge className="text-xs md:text-xl px-4 md:px-8 py-2 md:py-3 bg-[var(--gold)] text-black font-bold">طالب الشهر</Badge>}
              </Card>
            ))}
          </div>
        </div>

        {/* بحاجة متابعة */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          <Card className="glass-card p-6 md:p-10 card-glow border-red-500/30">
            <h3 className="text-2xl md:text-4xl font-black text-center mb-6 md:mb-8 text-red-600 flex items-center justify-center gap-2 md:gap-4">
              <MessageCircle className="w-8 md:w-12 h-8 md:h-12" />
              بحاجة إلى متابعة
            </h3>
            <div className="space-y-4 md:space-y-6">
              {needsAttention.map((s, i) => (
                <div key={i} className="p-4 md:p-6 rounded-2xl bg-red-50 border border-red-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <p className="text-lg md:text-2xl font-bold">{s.name}</p>
                  <span className="text-2xl md:text-3xl font-black text-red-600">{s.attendance}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="glass-card p-6 md:p-10 card-glow border-green-500/30">
            <h3 className="text-2xl md:text-4xl font-black text-center mb-6 md:mb-8 text-green-600 flex items-center justify-center gap-2 md:gap-4">
              <Trophy className="w-8 md:w-12 h-8 md:h-12" />
              إنجازات الشهر
            </h3>
            <div className="space-y-4 md:space-y-6 text-right">
              <p className="text-base md:text-2xl">✅ تم حفظ <span className="font-black text-primary">58 جزءًا</span> هذا الشهر</p>
              <p className="text-base md:text-2xl">✅ <span className="font-black text-[var(--gold)]">7 طلاب</span> أكملوا الختمة</p>
              <p className="text-base md:text-2xl">✅ تم توزيع <span className="font-black text-purple-600">23 مكافأة</span></p>
            </div>
          </Card>
        </div>

        {/* أزرار سريعة */}
        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8">
          <Button size="lg" className="text-base md:text-2xl px-6 md:px-12 py-4 md:py-8 bg-primary hover:bg-primary/90 w-full md:w-auto" onClick={() => navigate("/attendance")}>
            <FileCheck2 className="w-5 h-5 md:w-8 md:h-8 ml-3 md:ml-4" />
            تسجيل حضور اليوم
          </Button>
          <Button size="lg" variant="outline" className="text-base md:text-2xl px-6 md:px-12 py-4 md:py-8 border-2 border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black w-full md:w-auto">
            تصدير تقرير الشهر
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;