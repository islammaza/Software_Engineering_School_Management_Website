// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Trophy,
  Edit,
  Save,
  X,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import dashboardApi from "@/lib/api/dashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [editingStats, setEditingStats] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeGroups: 0,
    averageNote: 0,
    distinguishedStudents: 0,
  });

  const [tempStats, setTempStats] = useState({ ...stats });

  const [topMemorizers, setTopMemorizers] = useState<any[]>([]);

  const [needsAttention, setNeedsAttention] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const today = new Date().toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const hijriDate = "21 جمادى الأولى 1447 هـ";

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const { data, error } = await dashboardApi.getFullDashboard();
      if (error) {
        toast({
          variant: "destructive",
          title: "خطأ",
          description: "فشل تحميل بيانات لوحة التحكم",
        });
        console.error(error);
        setLoading(false);
        return;
      }

      if (data?.stats) {
        setStats({
          totalStudents: data.stats.totalStudents,
          activeGroups: data.stats.activeGroups,
          averageNote: data.stats.averageNote ?? 0,
          distinguishedStudents: data.stats.distinguishedCount,
        });
      }

      if (data?.topMemorizers) {
        setTopMemorizers(
          data.topMemorizers.map((s: any, idx: number) => ({
            id: s.student_id ?? idx,
            name: s.full_name,
            group: s.group_name ?? "",
            progress: s.final_note,
          }))
        );
      }

      if (data?.needsAttention) {
        setNeedsAttention(
          data.needsAttention.map((s: any) => ({
            id: s.student_id,
            name: s.full_name,
            attendance: `${s.final_note}%`,
          }))
        );
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل تحميل بيانات لوحة التحكم",
      });
      console.error(err);
    }
  };

  const handleRefresh = () => {
    toast({
      title: "جاري التحديث...",
      description: "يتم تحديث بيانات لوحة التحكم",
    });
    loadDashboard();
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-16 py-12 px-4 sm:px-6 lg:px-8">
        {/* مرحباً + التاريخ + الحديث الشريف */}
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gradient-durar mb-6">
            مرحباً بك في دار القرآن
          </h1>
          <div className="flex items-center justify-center gap-6 text-lg sm:text-2xl text-muted-foreground mb-8">
            <span className="font-bold">{today}</span>
            <span className="text-[var(--gold)] font-bold">| {hijriDate}</span>
          </div>

          {}
          <div className="mt-8 py-6">
            <p className="text-xl sm:text-2xl lg:text-3xl font-amiri italic leading-loose max-w-4xl mx-auto px-6">
              <span className="text-muted-foreground font-medium">
                قَالَ رَسُولُ اللَّهِ{" "}
              </span>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-700 drop-shadow-lg mx-2 inline-block">
                ﷺ
              </span>
              <span className="text-foreground">
                : «خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ»
              </span>
            </p>
            <p className="text-sm sm:text-base text-muted-foreground mt-3 font-bold text-center">
              (رواه البخاري)
            </p>
          </div>

          <div className="w-full h-3 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-80 my-12 max-w-4xl mx-auto" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-10 max-w-6xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-black text-gradient-durar">
              الإحصائيات العامة
            </h2>
            <Button
              onClick={handleRefresh}
              disabled={loading}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
              <span>تحديث</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="glass-card p-8 text-center shadow-2xl border border-primary/10">
                  <Skeleton className="w-14 h-14 mx-auto mb-6 rounded-full" />
                  <Skeleton className="h-20 w-32 mx-auto mb-4" />
                  <Skeleton className="h-6 w-24 mx-auto" />
                </Card>
              ))
            ) : (
              [
              {
                label: "إجمالي الطلاب",
                value: stats.totalStudents,
                icon: Users,
                color: "text-primary",
              },
              {
                label: "المجموعات",
                value: stats.activeGroups,
                icon: BookOpen,
                color: "text-[var(--gold)]",
              },
              {
                label: "معدل المدرسة",
                value: stats.averageNote,
                unit: "",
                icon: TrendingUp,
                color: "text-green-600",
              },
              {
                label: "المتميزون",
                value: stats.distinguishedStudents,
                icon: Award,
                color: "text-purple-600",
              },
            ].map((stat, i) => (
              <Card
                key={i}
                className="glass-card p-8 text-center hover:scale-105 transition-all shadow-2xl border border-primary/10"
              >
                <stat.icon className={`w-14 h-14 mx-auto mb-6 ${stat.color}`} />
                {editingStats ? (
                  <Input
                    type="number"
                    value={tempStats[Object.keys(tempStats)[i]]}
                    onChange={(e) =>
                      setTempStats({
                        ...tempStats,
                        [Object.keys(tempStats)[i]]:
                          parseFloat(e.target.value) || 0,
                      })
                    }
                    className="text-6xl font-black text-center mb-2"
                  />
                ) : (
                  <div className="mb-4">
                    <p className="text-7xl font-black text-foreground leading-none">
                      {stat.value}
                    </p>
                    {stat.unit && (
                      <p className="text-xl font-medium text-muted-foreground mt-1">
                        {stat.unit}
                      </p>
                    )}
                  </div>
                )}
                <p className="text-xl font-bold text-muted-foreground">
                  {stat.label}
                </p>
              </Card>
            )))}
            
          </div>
        </div>

        {/* أبطال الحفظ */}
        <div>
          <h2 className="text-4xl sm:text-5xl font-black text-center mb-12 text-gradient-durar">
            أبطال المدرسة
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="glass-card p-8 border-2 border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <Skeleton className="w-16 h-16 rounded-full" />
                      <div className="text-right space-y-2">
                        <Skeleton className="h-8 w-40" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-16 w-24" />
                  </div>
                </Card>
              ))
            ) : topMemorizers.length === 0 ? (
              <Card className="glass-card p-8 border-2 border-primary/20">
                <p className="text-center text-2xl font-bold text-muted-foreground">
                  لا يوجد أبطال حتى الآن - استمروا في العمل الجاد! 💪
                </p>
              </Card>
            ) : (
              topMemorizers.map((student, i) => (
              <Card
                key={student.id}
                className={`glass-card p-8 border-2 ${
                  i === 0
                    ? "border-[var(--gold)] shadow-2xl"
                    : "border-primary/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-green-700 flex items-center justify-center text-white text-3xl font-black shadow-xl">
                      {i + 1}
                    </div>
                    <div className="text-right">
                      <h3 className="text-2xl sm:text-3xl font-black text-foreground">
                        {student.name}
                      </h3>
                      <p className="text-lg text-muted-foreground">
                        {student.group}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-5xl sm:text-6xl font-black text-green-700">
                      {student.progress}%
                    </p>
                  </div>
                </div>
              </Card>
            )))
            }
          </div>
        </div>

        {/* بحاجة إلى متابعة */}
        <div>
          <h2 className="text-4xl sm:text-5xl font-black text-center mb-12 text-gradient-durar">
            بحاجة إلى متابعة
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 2 }).map((_, i) => (
                <Card key={i} className="glass-card p-8 border-2 border-red-500/30">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-16 w-24" />
                  </div>
                </Card>
              ))
            ) : needsAttention.length === 0 ? (
              <Card className="glass-card p-8 border-2 border-green-500/30">
                <p className="text-center text-2xl font-bold text-green-600">
                  لا يوجد طلاب بحاجة إلى متابعة - ممتاز! 🎉
                </p>
              </Card>
            ) : (
              needsAttention.map((s) => (
              <Card
                key={s.id}
                className="glass-card p-8 border-2 border-red-500/30 hover:border-red-500 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <h3 className="text-2xl sm:text-3xl font-black text-red-600">
                      {s.name}
                    </h3>
                  </div>
                  <p className="text-5xl sm:text-6xl font-black text-red-600">
                    {s.attendance}
                  </p>
                </div>
              </Card>
            )))
            }
          </div>
        </div>

        <div className="text-center py-20">
          <div className="w-full h-3 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-80 my-12 max-w-4xl mx-auto" />
          <p className="text-3xl sm:text-4xl font-amiri italic text-gradient-durar leading-relaxed max-w-5xl mx-auto px-6">
            "فَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ ۖ وَمَنْ يَعْمَلْ
            مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ"
          </p>
          <p className="text-lg sm:text-xl text-muted-foreground mt-6 font-bold">
            سورة الزلزلة
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
