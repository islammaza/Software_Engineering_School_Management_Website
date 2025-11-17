import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Building, User, Mail, Phone, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const Settings = () => {
  const [schoolInfo, setSchoolInfo] = useState({
    name: "مدرسة الإيمان",
    adminName: "أحمد محمود",
    email: "admin@example.com",
    phone: "0777896525",
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold mb-2">الإعدادات</h1>
          <p className="text-muted-foreground">إدارة معلومات الحساب والمدرسة</p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">معلومات الحساب</TabsTrigger>
            <TabsTrigger value="about">من نحن</TabsTrigger>
            <TabsTrigger value="contact">اتصل بنا</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <div className="bg-card p-6 rounded-xl border border-border space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" />
                  معلومات المدرسة
                </h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">اسم المدرسة</Label>
                    <Input
                      id="schoolName"
                      value={schoolInfo.name}
                      onChange={(e) => setSchoolInfo({ ...schoolInfo, name: e.target.value })}
                      className="text-right"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminName">اسم المسؤول</Label>
                    <Input
                      id="adminName"
                      value={schoolInfo.adminName}
                      onChange={(e) => setSchoolInfo({ ...schoolInfo, adminName: e.target.value })}
                      className="text-right"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={schoolInfo.email}
                      onChange={(e) => setSchoolInfo({ ...schoolInfo, email: e.target.value })}
                      className="text-right"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={schoolInfo.phone}
                      onChange={(e) => setSchoolInfo({ ...schoolInfo, phone: e.target.value })}
                      className="text-right"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="font-bold mb-4">تغيير كلمة المرور</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                    <Input id="currentPassword" type="password" className="text-right" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                    <Input id="newPassword" type="password" className="text-right" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                    <Input id="confirmPassword" type="password" className="text-right" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button size="lg">حفظ التغييرات</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <div className="bg-card p-6 rounded-xl border border-border space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">دار القرآن</h2>
                <p className="text-muted-foreground">نظام إدارة مدارس تحفيظ القرآن</p>
              </div>

              <div className="space-y-4 text-right">
                <p className="leading-relaxed">
                  دار القرآن هو نظام متكامل لإدارة مدارس ودور تحفيظ القرآن الكريم، يوفر أدوات سهلة وفعالة
                  لمتابعة الطلاب وإدارة الحلقات والمجموعات.
                </p>
                <p className="leading-relaxed">
                  نسعى لتسهيل عملية التحفيظ والمتابعة من خلال واجهة بسيطة وسهلة الاستخدام، مع توفير
                  تقارير تفصيلية وإحصائيات دقيقة لقياس التقدم والأداء.
                </p>
                
                <div className="pt-6 border-t border-border">
                  <h3 className="font-bold mb-3">مميزات النظام:</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• إدارة شاملة للطلاب والمجموعات</li>
                    <li>• متابعة دقيقة لتقدم الحفظ والمراجعة</li>
                    <li>• تقارير تفصيلية قابلة للطباعة</li>
                    <li>• إحصائيات ومؤشرات أداء واضحة</li>
                    <li>• واجهة بسيطة وسهلة الاستخدام</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="bg-card p-6 rounded-xl border border-border space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  تواصل معنا
                </h2>
                <p className="text-muted-foreground mb-6">
                  هل لديك استفسار أو اقتراح؟ نحن هنا للمساعدة
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">الاسم</Label>
                  <Input id="contactName" placeholder="اسمك الكامل" className="text-right" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">البريد الإلكتروني</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="example@email.com"
                    className="text-right"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactMessage">الرسالة</Label>
                  <Textarea
                    id="contactMessage"
                    placeholder="اكتب رسالتك هنا..."
                    className="min-h-[150px] text-right"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button size="lg">إرسال الرسالة</Button>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="font-bold mb-4">معلومات التواصل</h3>
                <div className="space-y-3 text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5" />
                    <span>info@darquran.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5" />
                    <span dir="ltr">0778527469</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
