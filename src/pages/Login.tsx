// src/pages/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// مكوّن الزخرفة الإسلامية الذهبية
const IslamicOrnament = () => (
  <div className="w-full h-2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60 my-8" />
);

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // تسجيل دخول وهمي - في التطبيق الحقيقي سيتم استدعاء الباك إند
    navigate("/groups");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 via-background to-background px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* الهيدر الإسلامي الجميل مع الحركة */}
        <div className="text-center mb-10">
          <div className="inline-block p-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 quran-glow animate-float mb-8 shadow-2xl">
            <BookOpen className="w-20 h-20 text-primary" strokeWidth={1.5} />
          </div>

          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-4">
            دار القرآن
          </h1>

          <IslamicOrnament />

          <p className="text-2xl text-muted-foreground font-medium leading-relaxed">
            بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
          <p className="text-xl text-muted-foreground mt-3">
            تسجيل الدخول إلى بوابة الخير والبركة
          </p>
        </div>

        {/* بطاقة تسجيل الدخول الزجاجية */}
        <div className="glass-card p-8 rounded-2xl border border-primary/20 shadow-2xl backdrop-blur-md">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            مرحباً بك مرة أخرى
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@darquran.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="text-right text-lg h-12 border-primary/30 focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-lg">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="text-right text-lg h- h-12 border-primary/30 focus:border-primary transition-all"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-xl py-7 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90% text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              تسجيل الدخول
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              ليس لديك حساب؟{" "}
              <Link to="/signup" className="text-primary font-bold hover:underline transition-all">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>

        {/* العودة للرئيسية */}
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