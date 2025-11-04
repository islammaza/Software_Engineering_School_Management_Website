import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BookOpen, LayoutDashboard, Users, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "لوحة التحكم", path: "/dashboard" },
    { icon: Users, label: "المجموعات", path: "/groups" },
    { icon: Settings, label: "الإعدادات", path: "/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-lg">دار القرآن</h1>
                <p className="text-xs text-muted-foreground">مدرسة الإيمان</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-l border-border min-h-[calc(100vh-4rem)] p-4">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth ${
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
