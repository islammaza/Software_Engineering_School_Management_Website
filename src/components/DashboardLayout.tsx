// src/components/DashboardLayout.tsx
import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  BookOpen, 
  LayoutDashboard, 
  Users, 
  FileCheck2, 
  Settings, 
  LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => navigate("/");

  const navItems = [
    { icon: LayoutDashboard, label: "لوحة التحكم", path: "/dashboard" },
    { icon: Users,           label: "الحلقات والمجموعات", path: "/groups" },
    { icon: FileCheck2,      label: "الحضور والغياب", path: "/attendance" },
    { icon: Settings,        label: "الإعدادات", path: "/settings" },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-[hsl(var(--durar-cream))]">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-top z-50 shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo + Name */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-[var(--gold)] p-3 shadow-2xl">
                <BookOpen className="w-full h-full text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-gradient-durar">دار القرآن</h1>
                <p className="text-lg text-muted-foreground font-bold">نظام إدارة حلقات التحفيظ</p>
              </div>
            </div>

            {/* Logout */}
            <Button 
              variant="ghost" 
              size="lg" 
              onClick={handleLogout}
              className="text-xl font-bold text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-6 h-6 ml-3" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-l border-border min-h-screen p-8 shadow-2xl">
          <nav className="space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-5 px-8 py-6 rounded-2xl text-2xl font-bold transition-all duration-300 group ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-primary to-[var(--gold)] text-white shadow-2xl"
                    : "text-foreground hover:bg-primary/5 hover:text-primary hover:translate-x-3"
                }`}
              >
                <item.icon className={`w-8 h-8 ${isActive(item.path) ? "text-white" : "text-primary group-hover:scale-110"} transition-all`} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10 lg:p-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;