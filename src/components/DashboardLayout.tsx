// src/components/DashboardLayout.tsx
import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  BookOpen, 
  LayoutDashboard, 
  Users, 
  FileCheck2, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => navigate("/");

  const navItems = [
    { icon: LayoutDashboard, label: "لوحة التحكم", path: "/dashboard" },
    { icon: Users,           label: "المجموعات", path: "/groups" },
    { icon: Settings,        label: "الإعدادات", path: "/settings" },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-[hsl(var(--durar-cream))]">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40 shadow-lg">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo + Name */}
            <div className="flex items-center gap-3 md:gap-5">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary/10 via-[var(--gold)]/20 to-primary/10 p-2 md:p-3 shadow-2xl border-2 border-[var(--gold)]/30 flex-shrink-0">
                <BookOpen className="w-full h-full text-[var(--gold)]" strokeWidth={1.8} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-black text-gradient-durar">دار القرآن</h1>
                <p className="text-xs md:text-sm text-muted-foreground font-bold">نظام إدارة حلقات التحفيظ</p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>

              {/* Logout */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-xs md:text-base font-bold text-destructive hover:bg-red-100 hover:text-red-700 transition-all duration-300 hover:shadow-lg rounded-xl whitespace-nowrap"
              >
                <LogOut className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                <span className="hidden sm:inline">تسجيل الخروج</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 lg:w-80 bg-white border-l border-border min-h-screen p-6 lg:p-8 shadow-2xl">
          <nav className="space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-nav-link text-base lg:text-lg ${isActive(item.path) ? "active" : ""}`}
              >
                <item.icon className="w-5 h-5 lg:w-6 lg:h-6" />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Sidebar - Mobile */}
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-20 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Mobile Sidebar */}
            <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-l border-border p-6 shadow-2xl z-30 md:hidden overflow-y-auto">
              <nav className="space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`sidebar-nav-link text-base ${isActive(item.path) ? "active" : ""}`}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-10 lg:p-16 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;