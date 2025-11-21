// src/pages/Landing.tsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, TrendingUp, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const IslamicOrnament = () => (
  <div className="w-full h-3 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-80 my-12" />
);

const Landing = () => {
  useEffect(() => {
    document.title = "دار القرآن الكريم - نظام إدارة حلقات التحفيظ";
  }, []);

  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-b from-primary/5 via-background to-background">
      {/* خلفية إسلامية خفيفة جداً */}
      <div className="fixed inset-0 opacity-5 pointer-events-none -z-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2348bb78'%3E%3Cpath d='M40 10v60M10 40h60M20 20l40 40M20 60L60 20' stroke-width='2' stroke='%2348bb78' opacity='0.1'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Hero Section */}
      <section className="relative py-24 px-6 text-center">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="inline-block p-10 rounded-full bg-gradient-to-br from-primary/10 via-[var(--gold)]/20 to-primary/10 quran-glow shadow-2xl border-4 border-[var(--gold)]/20">
              <BookOpen className="w-32 h-32 text-[var(--gold)]" strokeWidth={1.8} />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-[var(--gold)] via-60% to-primary bg-clip-text text-transparent mb-8 leading-tight"
          >
            دار القرآن الكريم
          </motion.h1>

          <IslamicOrnament />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-2xl md:text-3xl text-foreground/90 font-medium leading-relaxed max-w-4xl mx-auto mb-12"
          >
            وَمَنْ أَحْسَنُ قَوْلًا مِّمَّن دَعَا إِلَى اللَّهِ وَعَمِلَ صَالِحًا وَقَالَ إِنَّنِي مِنَ الْمُسْلِمِينَ
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-8 justify-center"
          >
            <Link to="/login">
              <Button size="lg" className="text-2xl px-16 py-8 bg-primary hover:bg-primary/90 text-white shadow-2xl hover:shadow-[var(--gold)]/40 transition-all font-bold">
                <Sparkles className="mr-4 w-8 h-8" />
                ابدأ الآن مجانًا
              </Button>
            </Link>
            <Link to="/signup" className="sm:mr-8">
              <Button size="lg" variant="outline" className="text-2xl px-16 py-8 border-2 border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-all font-bold">
                إنشاء حساب مدرسة
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl md:text-5xl font-bold text-center mb-20 bg-gradient-to-r from-primary to-[var(--gold)] bg-clip-text text-transparent"
          >
            بركة في كل خطوة مع دار القرآن
          </motion.h2>

          <div className="grid lg:grid-cols-3 gap-10">
            {[
              { icon: Users, title: "إدارة شاملة وسهلة", desc: "إضافة الطلاب، تقسيمهم لمجموعات، متابعة الحضور والتقدم يوميًا" },
              { icon: TrendingUp, title: "تحليلات ذكية ودقيقة", desc: "تعرف على أداء كل طالب، من يحتاج دعمًا، ومن يستحق التكريم" },
              { icon: Award, title: "تقارير إسلامية مزخرفة", desc: "PDF فاخر بتصميم عربي أصيل، جاهز للطباعة والتوزيع" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -15, scale: 1.03 }}
                className="bg-card/80 backdrop-blur-md rounded-3xl p-10 text-center border border-border/50 card-glow hover:shadow-2xl transition-all"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-[var(--gold)]/10 mx-auto mb-8 flex items-center justify-center group-hover:quran-glow transition-all">
                  <feature.icon className="w-14 h-14 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-6">{feature.title}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 text-center border-t border-border/30 bg-gradient-to-t from-primary/5 to-transparent">
        <p className="text-lg text-muted-foreground">
          © 2025 دار القرآن الكريم • جزاكم الله خيرًا وبارك في جهودكم
        </p>
      </footer>
    </div>
  );
};

export default Landing;