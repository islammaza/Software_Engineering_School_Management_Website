import DashboardLayout from "@/components/DashboardLayout";
import { Users, BookOpen, TrendingUp, TrendingDown } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      icon: Users,
      label: "إجمالي الطلاب",
      value: "45",
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      icon: BookOpen,
      label: "المجموعات",
      value: "8",
      color: "bg-green-500/10 text-green-600",
    },
    {
      icon: TrendingUp,
      label: "المتوسط العام",
      value: "78%",
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      icon: TrendingDown,
      label: "الطلاب الأقل مستوى",
      value: "5",
      color: "bg-orange-500/10 text-orange-600",
    },
  ];

  const topStudents = [
    { name: "عبد الرحمن بن صالح", progress: "95%", group: "مجموعة الفرقان" },
    { name: "يوسف بن علي", progress: "92%", group: "مجموعة النور" },
    { name: "خالد بن أحمد", progress: "88%", group: "مجموعة الإحسان" },
  ];

  const lowStudents = [
    { name: "عمر بن الخطاب", progress: "45%", group: "مجموعة النهدي" },
    { name: "سليمان القريشي", progress: "52%", group: "مجموعة النور" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">لوحة التحكم</h1>
          <p className="text-muted-foreground">نظرة عامة على أداء المدرسة</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-xl border border-border hover:shadow-md transition-smooth"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Students Lists */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Students */}
          <div className="bg-card p-6 rounded-xl border border-border">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              الطلاب المتميزون
            </h2>
            <div className="space-y-3">
              {topStudents.map((student, index) => (
                <div
                  key={index}
                  className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{student.name}</h3>
                    <span className="text-green-600 font-bold">{student.progress}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{student.group}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Low Performing Students */}
          <div className="bg-card p-6 rounded-xl border border-border">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-orange-600" />
              الطلاب بحاجة لمتابعة
            </h2>
            <div className="space-y-3">
              {lowStudents.map((student, index) => (
                <div
                  key={index}
                  className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{student.name}</h3>
                    <span className="text-orange-600 font-bold">{student.progress}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{student.group}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
