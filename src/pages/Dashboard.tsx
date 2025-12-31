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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  LabelList,
} from "recharts";
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
  const [groupAverages, setGroupAverages] = useState<any[]>([]);
  const [moduleAverages, setModuleAverages] = useState<any[]>([]);
  const [topModules, setTopModules] = useState<any[]>([]);
  const [bottomModules, setBottomModules] = useState<any[]>([]);
  const [gradeDistribution, setGradeDistribution] = useState<any[]>([]);
  const [groupGradeDistributions, setGroupGradeDistributions] = useState<any[]>(
    []
  );
  const [showGroupDistributions, setShowGroupDistributions] = useState(false);
  const [loading, setLoading] = useState(false);

  const today = new Date().toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const hijriDate = "21 جمادى الأولى 1447 هـ";

  const maxGroupAverage = Math.max(
    100,
    ...(groupAverages || []).map((g: any) => g.average || 0)
  );

  const maxModuleAverage = Math.max(
    100,
    ...(moduleAverages || []).map((m: any) => m.average || 0)
  );

  const moduleOverallAverage = moduleAverages.length
    ? Number(
        (
          moduleAverages.reduce(
            (sum: number, m: any) => sum + (m.average || 0),
            0
          ) / moduleAverages.length
        ).toFixed(1)
      )
    : 0;

  const makeSparkline = (avg: number) => {
    const clamp = (v: number) => Math.max(0, Math.min(100, v));
    return [
      { x: 0, y: clamp(avg - 4) },
      { x: 1, y: clamp(avg - 1.5) },
      { x: 2, y: clamp(avg) },
      { x: 3, y: clamp(avg + 2) },
      { x: 4, y: clamp(avg + 1) },
    ];
  };

  const loadDashboard = async () => {
    try {
      // Get and log the current school ID
      const schoolId = localStorage.getItem("schoolId");
      console.log("Current School ID:", schoolId);
      if (!schoolId) {
        toast({
          variant: "destructive",
          title: "لا يوجد مدرسة محددة",
          description:
            "تعذر تحميل البيانات لعدم توفر معرف المدرسة. برجاء تسجيل الدخول أو اختيار مدرسة.",
        });
        return;
      }
      setLoading(true);
      const { data, error } = await dashboardApi.getFullDashboard(schoolId);
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

      if (data?.groupAverages) {
        setGroupAverages(data.groupAverages);
      }

      if (data?.moduleAverages) {
        setModuleAverages(data.moduleAverages);
      }

      if (data?.topModules) {
        setTopModules(data.topModules);
      }

      if (data?.bottomModules) {
        setBottomModules(data.bottomModules);
      }

      if (data?.gradeDistribution) {
        setGradeDistribution(data.gradeDistribution);
      }

      if (data?.groupGradeDistributions) {
        setGroupGradeDistributions(data.groupGradeDistributions);
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
      <div className="dashboard-scale mx-auto">
        <div className="space-y-16 py-12 px-4 sm:px-6 lg:px-8">
          {/* مرحباً + التاريخ + الحديث الشريف */}
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gradient-durar mb-6">
              مرحباً بك في دار القرآن
            </h1>
            <div className="flex items-center justify-center gap-6 text-lg sm:text-2xl text-muted-foreground mb-8">
              <span className="font-bold">{today}</span>
              <span className="text-[var(--gold)] font-bold">
                | {hijriDate}
              </span>
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
                <RefreshCw
                  className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                />
                <span>تحديث</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {loading
                ? // Loading skeleton
                  Array.from({ length: 4 }).map((_, i) => (
                    <Card
                      key={i}
                      className="glass-card p-8 text-center shadow-2xl border border-primary/10"
                    >
                      <Skeleton className="w-14 h-14 mx-auto mb-6 rounded-full" />
                      <Skeleton className="h-20 w-32 mx-auto mb-4" />
                      <Skeleton className="h-6 w-24 mx-auto" />
                    </Card>
                  ))
                : [
                    {
                      label: "إجمالي الطلاب",
                      value: stats.totalStudents,
                      icon: Users,
                      color: "text-primary",
                    },
                    {
                      label: "مجموعات",
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
                      <stat.icon
                        className={`w-14 h-14 mx-auto mb-6 ${stat.color}`}
                      />
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
                          className="text-[clamp(1.25rem,3.2vw,2.0rem)] sm:text-[clamp(1.45rem,2.9vw,2.25rem)] md:text-[clamp(1.6rem,2.6vw,2.45rem)] font-black text-center mb-2 w-full max-w-[6rem] mx-auto"
                        />
                      ) : (
                        <div className="mb-4">
                          <p className="text-[clamp(1.35rem,4.0vw,2.2rem)] sm:text-[clamp(1.55rem,3.6vw,2.55rem)] md:text-[clamp(1.75rem,3.2vw,2.85rem)] lg:text-[clamp(1.95rem,2.8vw,3.1rem)] font-black text-foreground leading-tight break-words max-w-full text-center mx-auto">
                            {stat.value}
                          </p>
                          {stat.unit && (
                            <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">
                              {stat.unit}
                            </p>
                          )}
                        </div>
                      )}
                      <p className="text-sm sm:text-base font-bold text-muted-foreground">
                        {stat.label}
                      </p>
                    </Card>
                  ))}
            </div>
          </div>

          {/* أداء المجموعات (المعدل لكل مجموعة) */}
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl sm:text-4xl font-black text-gradient-durar">
                معدل المجموعات
              </h2>
              {loading && (
                <span className="text-sm text-muted-foreground">
                  جاري التحميل...
                </span>
              )}
            </div>
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-5 w-28" />
                    <div className="flex-1 h-6 bg-muted/60 rounded-full overflow-hidden">
                      <Skeleton className="h-full w-3/4" />
                    </div>
                    <Skeleton className="h-6 w-14 rounded-full" />
                  </div>
                ))
              ) : groupAverages && groupAverages.length > 0 ? (
                groupAverages.map((g: any) => {
                  const width = `${Math.min(
                    100,
                    (g.average / maxGroupAverage) * 100
                  )}%`;
                  return (
                    <div key={g.group_id} className="flex items-center gap-4">
                      <span className="text-lg font-bold text-foreground min-w-[120px] text-right">
                        {g.group_name}
                      </span>
                      <div className="flex-1 h-6 bg-muted/60 rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-green-500"
                          style={{ width }}
                        />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {g.average}
                      </span>
                    </div>
                  );
                })
              ) : (
                <Card className="glass-card p-6 text-center text-muted-foreground">
                  لا توجد بيانات مجموعات حتى الآن
                </Card>
              )}
            </div>
          </div>

          {/* معدل المواد (جميع المواد) */}
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl sm:text-4xl font-black text-gradient-durar">
                معدل المواد
              </h2>
              {loading && (
                <span className="text-sm text-muted-foreground">
                  جاري التحميل...
                </span>
              )}
            </div>
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-5 w-40" />
                    <div className="flex-1 h-6 bg-muted/60 rounded-full overflow-hidden">
                      <Skeleton className="h-full w-3/4" />
                    </div>
                    <Skeleton className="h-6 w-14 rounded-full" />
                  </div>
                ))
              ) : moduleAverages && moduleAverages.length > 0 ? (
                moduleAverages.map((m: any) => {
                  const width = `${Math.min(
                    100,
                    (m.average / maxModuleAverage) * 100
                  )}%`;
                  return (
                    <div key={m.module_id} className="flex items-center gap-4">
                      <span className="text-lg font-bold text-foreground min-w-[160px] text-right">
                        {m.module_name}
                      </span>
                      <div className="flex-1 h-6 bg-muted/60 rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-purple-500"
                          style={{ width }}
                        />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {m.average}
                      </span>
                    </div>
                  );
                })
              ) : (
                <Card className="glass-card p-6 text-center text-muted-foreground">
                  لا توجد بيانات مواد حتى الآن
                </Card>
              )}
            </div>
          </div>

          {/* أداء المواد */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card border border-primary/10">
              <div className="flex items-center justify-between p-6 pb-2">
                <h3 className="text-2xl font-black text-foreground">
                  أفضل 3 مواد
                </h3>
                {loading && <Skeleton className="h-5 w-16" />}
              </div>
              <div className="p-6 pt-0 space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-12 w-24" />
                    </div>
                  ))
                ) : topModules && topModules.length > 0 ? (
                  topModules.map((m: any) => (
                    <Card key={m.module_id} className="p-4 border-primary/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-foreground">
                            {m.module_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            متوسط: {m.average}
                          </p>
                        </div>
                        <div className="w-28 h-14">
                          <AreaChart data={makeSparkline(m.average)}>
                            <Area
                              type="monotone"
                              dataKey="y"
                              stroke="#22c55e"
                              fill="#22c55e33"
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center">
                    لا توجد بيانات مواد حتى الآن
                  </p>
                )}
              </div>
            </Card>

            <Card className="glass-card border border-destructive/10">
              <div className="flex items-center justify-between p-6 pb-2">
                <h3 className="text-2xl font-black text-foreground">
                  أضعف 3 مواد
                </h3>
                {loading && <Skeleton className="h-5 w-16" />}
              </div>
              <div className="p-6 pt-0 space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-12 w-24" />
                    </div>
                  ))
                ) : bottomModules && bottomModules.length > 0 ? (
                  bottomModules.map((m: any) => (
                    <Card key={m.module_id} className="p-4 border-red-200/40">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-foreground">
                            {m.module_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            متوسط: {m.average}
                          </p>
                        </div>
                        <div className="w-28 h-14">
                          <AreaChart data={makeSparkline(m.average)}>
                            <Area
                              type="monotone"
                              dataKey="y"
                              stroke="#f97316"
                              fill="#f9731633"
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center">
                    لا توجد بيانات مواد حتى الآن
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* توزيع الدرجات */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-gradient-durar mb-6">
              توزيع الدرجات
            </h2>
            <Card className="glass-card p-6 border border-primary/10">
              {loading ? (
                <Skeleton className="h-64 w-full" />
              ) : gradeDistribution && gradeDistribution.length > 0 ? (
                <ChartContainer
                  className="w-full"
                  config={{
                    count: {
                      label: "عدد الطلاب",
                      color: "hsl(var(--primary))",
                    },
                  }}
                >
                  <BarChart data={gradeDistribution} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent labelKey="label" />}
                    />
                    <Bar
                      dataKey="count"
                      fill="var(--color-count)"
                      radius={[8, 8, 0, 0]}
                    >
                      <LabelList
                        dataKey="percentage"
                        position="top"
                        formatter={(value: any) => `${value}%`}
                        className="fill-foreground text-xs"
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              ) : (
                <p className="text-muted-foreground text-center">
                  لا توجد بيانات درجات حتى الآن
                </p>
              )}
            </Card>
          </div>

          {/* توزيع الدرجات لكل مجموعة */}
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl sm:text-3xl font-black text-gradient-durar">
                توزيع الدرجات لكل مجموعة
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGroupDistributions((v) => !v)}
              >
                {showGroupDistributions ? "إخفاء" : "عرض"}
              </Button>
            </div>

            {showGroupDistributions && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Card
                      key={i}
                      className="glass-card p-4 border border-primary/10"
                    >
                      <Skeleton className="h-6 w-40 mb-4" />
                      <Skeleton className="h-48 w-full" />
                    </Card>
                  ))
                ) : groupGradeDistributions &&
                  groupGradeDistributions.length > 0 ? (
                  groupGradeDistributions.map((g: any) => (
                    <Card
                      key={g.group_id}
                      className="glass-card p-4 border border-primary/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xl font-bold text-foreground">
                          {g.group_name}
                        </h4>
                      </div>
                      <ChartContainer
                        className="w-full"
                        config={{
                          count: {
                            label: "عدد الطلاب",
                            color: "hsl(var(--primary))",
                          },
                        }}
                      >
                        <BarChart data={g.bins} barSize={32}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                          />
                          <ChartTooltip
                            content={<ChartTooltipContent labelKey="label" />}
                          />
                          <Bar
                            dataKey="count"
                            fill="var(--color-count)"
                            radius={[8, 8, 0, 0]}
                          >
                            <LabelList
                              dataKey="percentage"
                              position="top"
                              formatter={(value: any) => `${value}%`}
                              className="fill-foreground text-xs"
                            />
                          </Bar>
                        </BarChart>
                      </ChartContainer>
                    </Card>
                  ))
                ) : (
                  <Card className="glass-card p-4 text-center text-muted-foreground">
                    لا توجد بيانات توزيع درجات للمجموعات
                  </Card>
                )}
              </div>
            )}
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
                  <Card
                    key={i}
                    className="glass-card p-8 border-2 border-primary/20"
                  >
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
                ))
              )}
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
                  <Card
                    key={i}
                    className="glass-card p-8 border-2 border-red-500/30"
                  >
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
                ))
              )}
            </div>
          </div>

          <div className="text-center py-20">
            <div className="w-full h-3 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-80 my-12 max-w-4xl mx-auto" />
            <p className="text-3xl sm:text-4xl font-amiri italic text-gradient-durar leading-relaxed max-w-5xl mx-auto px-6">
              "فَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ ۖ وَمَنْ
              يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ"
            </p>
            <p className="text-lg sm:text-xl text-muted-foreground mt-6 font-bold">
              سورة الزلزلة
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
