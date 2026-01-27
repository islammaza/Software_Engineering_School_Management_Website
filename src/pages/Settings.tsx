import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Building, User, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [schoolInfo, setSchoolInfo] = useState({
    name: "",
    adminName: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    passwordMismatch: false,
    weakPassword: false,
    wrongCurrentPassword: false,
  });

  // Hash function - must match signup/login
  const hashPassword = async (password: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  // Load school data on mount
  useEffect(() => {
    const loadSchoolData = async () => {
      setIsLoading(true);
      try {
        const schoolId = localStorage.getItem("schoolId");

        if (!schoolId) {
          alert("يرجى تسجيل الدخول أولاً");
          navigate("/login");
          return;
        }

        console.log("Loading school data for ID:", schoolId);

        const { data, error } = await supabase
          .from("schools")
          .select("*")
          .eq("id", schoolId)
          .single();

        if (error) throw error;

        console.log("School data loaded:", data);

        setSchoolInfo({
          name: data.name || "",
          adminName: data.admin_name || "",
          email: data.admin_email || "",
          phone: data.phone || "",
        });
      } catch (error: any) {
        console.error("Error loading school data:", error);
        alert("حدث خطأ في تحميل البيانات");
      } finally {
        setIsLoading(false);
      }
    };

    loadSchoolData();
  }, [navigate]);

  // Save school info
  const handleSaveSchoolInfo = async () => {
    setIsSaving(true);
    try {
      const schoolId = localStorage.getItem("schoolId");

      if (!schoolId) {
        alert("يرجى تسجيل الدخول أولاً");
        navigate("/login");
        return;
      }

      console.log("Updating school info...");

      const { error } = await supabase
        .from("schools")
        .update({
          name: schoolInfo.name,
          admin_name: schoolInfo.adminName,
          admin_email: schoolInfo.email,
          phone: schoolInfo.phone,
        })
        .eq("id", schoolId);

      if (error) throw error;

      // Update localStorage
      localStorage.setItem("adminName", schoolInfo.adminName);
      localStorage.setItem("adminEmail", schoolInfo.email);

      alert("✅ تم حفظ معلومات المدرسة بنجاح!");
    } catch (error: any) {
      console.error("Error saving school info:", error);
      alert("❌ فشل حفظ البيانات: " + (error.message || "حدث خطأ"));
    } finally {
      setIsSaving(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    // Validate passwords
    const newErrors = {
      passwordMismatch:
        passwordData.newPassword !== passwordData.confirmPassword,
      weakPassword: passwordData.newPassword.length < 6,
      wrongCurrentPassword: false,
    };

    setErrors(newErrors);

    if (newErrors.passwordMismatch) {
      alert("كلمتا المرور الجديدة غير متطابقتين");
      return;
    }

    if (newErrors.weakPassword) {
      alert("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    if (!passwordData.currentPassword) {
      alert("يرجى إدخال كلمة المرور الحالية");
      return;
    }

    setIsSaving(true);
    try {
      const schoolId = localStorage.getItem("schoolId");

      if (!schoolId) {
        alert("يرجى تسجيل الدخول أولاً");
        navigate("/login");
        return;
      }

      console.log("Step 1: Verifying current password...");

      // Hash current password and verify
      const currentHash = await hashPassword(passwordData.currentPassword);

      const { data: schoolData, error: fetchError } = await supabase
        .from("schools")
        .select("password_hashed")
        .eq("id", schoolId)
        .single();

      if (fetchError) throw fetchError;

      if (schoolData.password_hashed !== currentHash) {
        setErrors({ ...errors, wrongCurrentPassword: true });
        alert("❌ كلمة المرور الحالية غير صحيحة");
        setIsSaving(false);
        return;
      }

      console.log("Step 2: Updating to new password...");

      // Hash new password and update
      const newHash = await hashPassword(passwordData.newPassword);

      const { error: updateError } = await supabase
        .from("schools")
        .update({ password_hashed: newHash })
        .eq("id", schoolId);

      if (updateError) throw updateError;

      alert("✅ تم تغيير كلمة المرور بنجاح!");

      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Error changing password:", error);
      alert("❌ فشل تغيير كلمة المرور: " + (error.message || "حدث خطأ"));
    } finally {
      setIsSaving(false);
    }
  };

  // Main save handler
  const handleSaveAll = async () => {
    // If password fields are filled, change password
    if (
      passwordData.currentPassword ||
      passwordData.newPassword ||
      passwordData.confirmPassword
    ) {
      await handleChangePassword();
    }

    // Save school info
    await handleSaveSchoolInfo();
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto py-12 px-4">
        {/* العنوان "الإعدادات" بنفس ستايل "معلومات المدرسة" */}
        <div className="text-center">
          <h1 className="text-3xl font-black text-gradient-durar mb-2">
            الإعدادات
          </h1>
          <p className="text-xl text-muted-foreground">
            إدارة معلومات الحساب والمدرسة
          </p>
          <div className="w-full h-3 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-80 my-12 max-w-2xl mx-auto" />
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">معلومات الحساب</TabsTrigger>
            <TabsTrigger value="about">من نحن</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <div className="bg-card p-6 rounded-xl border border-border space-y-6">
              <div>
                {/* معلومات المدرسة – بنفس الستايل */}
                <h2 className="text-xl font-black text-gradient-durar mb-5 flex items-center gap-3 justify-center">
                  <Building className="w-10 h-10 text-[var(--gold)]" />
                  معلومات المدرسة
                </h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">اسم المدرسة</Label>
                    <Input
                      id="schoolName"
                      value={schoolInfo.name}
                      onChange={(e) =>
                        setSchoolInfo({ ...schoolInfo, name: e.target.value })
                      }
                      className="text-right"
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminName">اسم المسؤول</Label>
                    <Input
                      id="adminName"
                      value={schoolInfo.adminName}
                      onChange={(e) =>
                        setSchoolInfo({
                          ...schoolInfo,
                          adminName: e.target.value,
                        })
                      }
                      className="text-right"
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={schoolInfo.email}
                      onChange={(e) =>
                        setSchoolInfo({ ...schoolInfo, email: e.target.value })
                      }
                      className="text-right"
                      dir="ltr"
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={schoolInfo.phone}
                      onChange={(e) =>
                        setSchoolInfo({ ...schoolInfo, phone: e.target.value })
                      }
                      className="text-right"
                      dir="ltr"
                      disabled={isSaving}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="font-bold mb-4">تغيير كلمة المرور</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      className="text-right"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      className={`text-right ${
                        errors.weakPassword ? "border-red-500" : ""
                      }`}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      disabled={isSaving}
                    />
                    {errors.weakPassword && (
                      <p className="text-red-500 text-sm text-right">
                        كلمة المرور يجب أن تكون 6 أحرف على الأقل
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      className={`text-right ${
                        errors.passwordMismatch ? "border-red-500" : ""
                      }`}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      disabled={isSaving}
                    />
                    {errors.passwordMismatch && (
                      <p className="text-red-500 text-sm text-right">
                        كلمتا المرور غير متطابقتين
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* زر الحفظ – بنفس ستايل باقي الأزرار في الموقع */}
              <div className="flex justify-end mt-8">
                <Button
                  size="lg"
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-primary to-[var(--gold)] text-white hover:shadow-[var(--gold)]/50 text-xl px-12 py-7 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    "حفظ التغييرات"
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <div className="bg-card p-6 rounded-xl border border-border space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <BookOpen className="w-8 h-8 text-[var(--gold)]" />
                </div>
                <h2 className="text-2xl font-black text-gradient-durar mb-2">
                  دار القرآن
                </h2>
                <p className="text-muted-foreground">
                  نظام إدارة مدارس تحفيظ القرآن
                </p>
              </div>

              <div className="space-y-4 text-right">
                <p className="leading-relaxed">
                  دار القرآن هو نظام متكامل لإدارة مدارس ودور تحفيظ القرآن
                  الكريم، يوفر أدوات سهلة وفعالة لمتابعة الطلاب وإدارة الحلقات
                  والمجموعات.
                </p>
                <p className="leading-relaxed">
                  نسعى لتسهيل عملية التحفيظ والمتابعة من خلال واجهة بسيطة وسهلة
                  الاستخدام، مع توفير تقارير تفصيلية وإحصائيات دقيقة لقياس
                  التقدم والأداء.
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
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
