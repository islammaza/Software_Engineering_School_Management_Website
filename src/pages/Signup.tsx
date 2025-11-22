// src/pages/Signup.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// زخرفة إسلامية ذهبية
const IslamicOrnament = () => (
  <div className="w-full h-2 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-60 my-10 max-w-2xl mx-auto" />
);

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    schoolName: "",
    adminName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // تسجيل وهمي - في التطبيق الحقيقي سيتصل بالسيرفر
    navigate("/groups");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 via-background to-background px-4 py-12">
      <div className="w-full max-w-2xl">

        {/* الهيدر الإسلامي الفاخر */}
        <div className="text-center mb-12">
          <div className="inline-block p-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 quran-glow animate-float mb-8 shadow-2xl">
            <BookOpen className="w-24 h-24 text-primary" strokeWidth={1.5} />
          </div>

          <h1 className="text-6xl sm:text-7xl font-black bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-6">
            دار القرآن
          </h1>

          <IslamicOrnament />

          <p className="text-2xl sm:text-3xl font-amiri italic text-gradient-durar leading-relaxed mb-4">
            "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ"
          </p>
          <p className="text-lg text-muted-foreground font-bold">(رواه البخاري)</p>
        </div>

        {/* بطاقة التسجيل الزجاجية الفاخرة */}
        <div className="glass-card p-10 md:p-12 rounded-3xl border border-primary/20 shadow-2xl backdrop-blur-md">
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-10 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            إنشاء حساب مدرسة جديد
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="schoolName" className="text-lg font-bold">اسم المدرسة</Label>
                <Input
                  id="schoolName"
                  placeholder="مثال: دار تحفيظ القرآن"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  required
                  className="text-right text-lg h-14 border-primary/30 focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="adminName" className="text-lg font-bold">اسم المسؤول</Label>
                <Input
                  id="adminName"
                  placeholder="الاسم الكامل للمسؤول"
                  value={formData.adminName}
                  onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                  required
                  className="text-right text-lg h-14 border-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-lg font-bold">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@darquran.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="text-right text-lg h-14 border-primary/30 focus:border-primary transition-all"
                  dir="ltr"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone" className="text-lg font-bold">رقم الهاتف (اختياري)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="966xxxxxxxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="text-right text-lg h-14 border-primary/30 focus:border-primary transition-all"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="password" className="text-lg font-bold">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="text-right text-lg h-14 border-primary/30 focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-lg font-bold">تأكيد كلمة المرور</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="text-right text-lg h-14 border-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-2xl py-8 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold shadow-2xl hover:shadow-[var(--gold)]/40 transition-all duration-500"
            >
              إنشاء الحساب
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-lg text-muted-foreground">
              لديك حساب بالفعل؟{" "}
              <Link to="/login" className="text-primary font-bold hover:text-[var(--gold)] transition-all text-xl">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>

        {/* العودة للرئيسية */}
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