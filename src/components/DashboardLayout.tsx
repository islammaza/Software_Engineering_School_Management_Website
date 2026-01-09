// src/components/DashboardLayout.tsx
import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  BookOpen, 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getAdminName, logout } from "@/lib/auth";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [adminName, setAdminName] = useState<string>("");

  useEffect(() => {
    const name = getAdminName();
    setAdminName(name || "");
  }, []);

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    logout();
    // Use replace to prevent back button from returning to protected pages
    navigate("/", { replace: true });
    // Force reload to clear any cached state
    window.location.href = "/";
  };

  const navItems = [
    { icon: LayoutDashboard, label: "لوحة التحكم", path: "/dashboard" },
    { icon: Users,           label: "المجموعات", path: "/groups" },
    { icon: Settings,        label: "الإعدادات", path: "/settings" },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-[hsl(var(--durar-cream))]">
      {/* Header - Fixed at top */}
      <header className="bg-white border-b border-border fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo + Name */}
            <div className="flex items-center gap-3 md:gap-5">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary/10 via-[var(--gold)]/20 to-primary/10 p-2 md:p-3 shadow-2xl border-2 border-[var(--gold)]/30 flex-shrink-0">
                <BookOpen className="w-full h-full text-[var(--gold)]" strokeWidth={1.8} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-black text-gradient-durar">دار القرآن</h1>
                <p className="text-xs md:text-sm text-muted-foreground font-bold">
                  {adminName ? `مرحباً ${adminName}` : "نظام إدارة حلقات التحفيظ"}
                </p>
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

      {/* Add padding-top to account for fixed header */}
      <div className="pt-16 md:pt-20">
        {/* Sidebar - Desktop (Fixed position) */}
        <aside className="hidden md:block md:w-64 lg:w-80 bg-white border-l border-border shadow-2xl fixed top-16 md:top-20 right-0 bottom-0 overflow-y-auto z-40">
          <nav className="p-6 lg:p-8 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-nav-link text-base lg:text-lg ${isActive(item.path) ? "active" : ""}`}
              >
                <item.icon className="w-5 h-5 lg:w-6 lg:h-6" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Sidebar - Mobile (Overlay) */}
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Mobile Sidebar */}
            <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-l border-border p-6 shadow-2xl z-50 md:hidden overflow-y-auto">
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

        {/* Main Content - Scrollable with margin to account for fixed sidebar */}
        <main className="md:mr-64 lg:mr-80 p-4 md:p-6 lg:p-10 min-h-screen">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right text-2xl font-bold">
              تأكيد تسجيل الخروج
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right text-lg">
              هل أنت متأكد من رغبتك في تسجيل الخروج؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-start gap-3 mt-6">
            <AlertDialogCancel className="px-6 py-2 bg-gray-100 hover:bg-gray-200">
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 opacity-100"
            >
              نعم، تسجيل الخروج
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardLayout;
