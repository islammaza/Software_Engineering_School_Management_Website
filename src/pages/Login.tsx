// src/pages/Login.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { isAuthenticated } from "@/lib/auth";
import { IslamicOrnament } from "@/components/shared/IslamicOrnament";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirect to groups if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/groups", { replace: true });
    }
    
    // Prevent caching of this page
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function() {
      window.history.pushState(null, '', window.location.href);
    };
  }, [navigate]);

  // Must match Signup hash
  const hashPassword = async (password: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Step 1: Hashing password...");
      const hashedPassword = await hashPassword(formData.password);

      console.log("Step 2: Checking credentials...");

      // Find school with matching email and password
      const { data: schoolData, error: schoolError } = await supabase
        .from("schools")
        .select("*")
        .eq("admin_email", formData.email)
        .eq("password_hashed", hashedPassword)
        .single();

      console.log("Login result:", { schoolData, schoolError });

      if (schoolError || !schoolData) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Store session information locally (simple workaround)
      localStorage.setItem("schoolId", schoolData.id);
      localStorage.setItem("adminEmail", schoolData.admin_email);
      localStorage.setItem("adminName", schoolData.admin_name);

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً ${schoolData.admin_name}! 🌟`,
      });
      
      // Use replace to prevent back button issues
      navigate("/groups", { replace: true });
    } catch (error: any) {
      console.error('❌ Login error:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 via-background to-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 quran-glow animate-float mb-6 shadow-2xl">
            <BookOpen className="w-14 h-14 text-primary" strokeWidth={1.5} />
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-3">
            دار القرآن
          </h1>

          <IslamicOrnament className="my-8" />

          <p className="text-lg text-muted-foreground font-medium leading-relaxed">
            بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
          <p className="text-base text-muted-foreground mt-2">
            تسجيل الدخول إلى بوابة الخير والبركة
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-primary/20 shadow-2xl backdrop-blur-md">
          <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            مرحباً بك مرة أخرى
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@darquran.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                disabled={isLoading}
                className="text-right text-base h-10 border-primary/30 focus:border-primary transition-all"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">
                كلمة المرور
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                disabled={isLoading}
                className="text-right text-base h-10 border-primary/30 focus:border-primary transition-all"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full text-base py-5 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-500 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              ليس لديك حساب؟{" "}
              <Link
                to="/signup"
                className="text-primary font-bold hover:underline transition-all"
              >
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-muted-foreground hover:text-primary transition-all text-lg flex items-center justify-center gap-2"
          >
            <span>←</span> العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
