// src/pages/Signup.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";

const IslamicOrnament = () => (
  <div className="w-full h-2 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-60 my-10 max-w-2xl mx-auto" />
);

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    schoolName: "",
    adminName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    passwordMismatch: false,
    weakPassword: false,
  });

  const validateForm = () => {
    const newErrors = {
      passwordMismatch: formData.password !== formData.confirmPassword,
      weakPassword: formData.password.length < 6,
    };

    setErrors(newErrors);
    return !newErrors.passwordMismatch && !newErrors.weakPassword;
  };

  // Simple hash function (for demo - use bcrypt in production!)
  const hashPassword = async (password: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🚀 Form submitted!");

    if (!validateForm()) {
      toast({
        title: "خطأ في التحقق",
        description: errors.passwordMismatch 
          ? "كلمتا المرور غير متطابقتين" 
          : "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Step 1: Checking if email already exists...");

      // Check if email already exists
      const { data: existingSchool } = await supabase
        .from("schools")
        .select("admin_email")
        .eq("admin_email", formData.email)
        .single();

      if (existingSchool) {
        alert("البريد الإلكتروني مستخدم بالفعل");
        setIsLoading(false);
        return;
      }

      console.log("Step 2: Hashing password...");
      const hashedPassword = await hashPassword(formData.password);

      console.log("Step 3: Creating school record...");

      // Create school record with hashed password
      const { data: schoolData, error: schoolError } = await supabase
        .from("schools")
        .insert([
          {
            name: formData.schoolName,
            phone: formData.phone || null,
            admin_name: formData.adminName,
            admin_email: formData.email,
            password_hashed: hashedPassword,
          },
        ])
        .select()
        .single();

      console.log("School insert result:", { schoolData, schoolError });

      if (schoolError) throw schoolError;

      // Store session in localStorage (simple approach)
      localStorage.setItem("schoolId", schoolData.id);
      localStorage.setItem("adminEmail", schoolData.admin_email);
      localStorage.setItem("adminName", schoolData.admin_name);

      alert("✅ تم إنشاء الحساب بنجاح!");
      navigate("/groups");
    } catch (error: any) {
      console.error('❌ Full error object:', error);
      toast({
        title: "خطأ",
        description: "❌ فشل إنشاء الحساب: " + (error.message || "حدث خطأ"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 via-background to-background px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-block p-5 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 quran-glow animate-float mb-6 shadow-2xl">
            <BookOpen className="w-16 h-16 text-primary" strokeWidth={1.5} />
          </div>

          <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-4">
            دار القرآن
          </h1>

          <IslamicOrnament />

          <p className="text-lg sm:text-xl font-amiri italic text-gradient-durar leading-relaxed mb-3">
            "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ"
          </p>
          <p className="text-base text-muted-foreground font-bold">
            (رواه البخاري)
          </p>
        </div>

        <div className="glass-card p-6 md:p-8 rounded-2xl border border-primary/20 shadow-2xl backdrop-blur-md">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            إنشاء حساب مدرسة جديد
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="schoolName" className="text-base font-bold">
                  اسم المدرسة
                </Label>
                <Input
                  id="schoolName"
                  placeholder="مثال: دار تحفيظ القرآن"
                  value={formData.schoolName}
                  onChange={(e) =>
                    setFormData({ ...formData, schoolName: e.target.value })
                  }
                  required
                  disabled={isLoading}
                  className="text-right text-base h-10 border-primary/30 focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminName" className="text-base font-bold">
                  اسم المسؤول
                </Label>
                <Input
                  id="adminName"
                  placeholder="الاسم الكامل للمسؤول"
                  value={formData.adminName}
                  onChange={(e) =>
                    setFormData({ ...formData, adminName: e.target.value })
                  }
                  required
                  disabled={isLoading}
                  className="text-right text-base h-10 border-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-bold">
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@darquran.com"
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
                <Label htmlFor="phone" className="text-base font-bold">
                  رقم الهاتف (اختياري)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="966xxxxxxxxx"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={isLoading}
                  className="text-right text-base h-10 border-primary/30 focus:border-primary transition-all"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-bold">
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
                  className={`text-right text-base h-10 border-primary/30 focus:border-primary transition-all ${
                    errors.weakPassword ? "border-red-500" : ""
                  }`}
                />
                {errors.weakPassword && (
                  <p className="text-red-500 text-xs text-right">
                    كلمة المرور يجب أن تكون 6 أحرف على الأقل
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-base font-bold"
                >
                  تأكيد كلمة المرور
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  disabled={isLoading}
                  className={`text-right text-base h-10 border-primary/30 focus:border-primary transition-all ${
                    errors.passwordMismatch ? "border-red-500" : ""
                  }`}
                />
                {errors.passwordMismatch && (
                  <p className="text-red-500 text-xs text-right">
                    كلمتا المرور غير متطابقتين
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full text-base py-5 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold shadow-2xl hover:shadow-[var(--gold)]/40 transition-all duration-500 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري إنشاء الحساب...
                </>
              ) : (
                "إنشاء الحساب"
              )}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-lg text-muted-foreground">
              لديك حساب بالفعل؟{" "}
              <Link
                to="/login"
                className="text-primary font-bold hover:text-[var(--gold)] transition-all text-xl"
              >
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="text-lg text-muted-foreground hover:text-primary transition-all flex items-center justify-center gap-2"
          >
            <span>←</span> العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
