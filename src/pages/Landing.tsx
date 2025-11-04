import { Link } from "react-router-dom";
import { BookOpen, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-10 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-5xl font-bold mb-4 text-foreground">
              دار القرآن
            </h1>
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              نظام متكامل وسهل لإدارة حلقات تحفيظ القرآن، يساعد على متابعة
              الطلاب والمعلمين ومتابعة تقدمهم بكل سهولة
            </p>
          </div>
          <Link to="/login">
            <Button size="lg" className="text-lg px-8 py-6 h-auto">
              ابدأ الآن مجاناً
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            لماذا نظامنا هو الأفضل؟
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-smooth text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4">
                <Users className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">
                إدارة سهلة وفعالة للطلاب
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                تتبع تقدم الطلاب وإدارة حلقات التحفيظ بسهولة مع تقارير تفصيلية
                ومؤشرات واضحة
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-smooth text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4">
                <TrendingUp className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">منصة دقيقة للتحليل</h3>
              <p className="text-muted-foreground leading-relaxed">
                تحليلات شاملة وإحصائيات دقيقة لقياس الأداء ومعرفة مستويات الطلاب
                بسهولة
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-smooth text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4">
                <BookOpen className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">
                تقارير شاملة وخطة منظمة
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                تسجيل تقدم الطلاب بشكل منظم مع إمكانية PDF للتقارير وإدارة كاملة
                للجداول والحلقات
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-6 px-4 mt-12">
        <div className="container mx-auto text-center">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-4">
          </div>
          <p className="text-muted-foreground text-sm">
            © 2025 دار القرآن. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
