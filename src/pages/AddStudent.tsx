import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, AlertCircle, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

const AddStudent = () => {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    birthdate: "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    contact?: string;
    birthdate?: string;
    general?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return "اسم الطالب مطلوب";
    if (name.trim().length < 3) return "الاسم يجب أن يحتوي على 3 أحرف على الأقل";
    if (name.trim().length > 100) return "الاسم طويل جداً";
    
    const validNameRegex = /^[\p{L}\p{M}\s'.،-]+$/u;
    if (!validNameRegex.test(name.trim())) {
      return "الاسم يحتوي على أحرف غير مسموحة";
    }
    
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone) return "رقم الهاتف مطلوب";
    
    const cleanPhone = phone.replace(/[\s\-+()]/g, '');
    
    if (!/^\d+$/.test(cleanPhone)) return "يجب أن يحتوي رقم الهاتف على أرقام فقط";
    if (cleanPhone.length !== 10) return "رقم الهاتف يجب أن يكون 10 أرقام";
    
    const mobileRegex = /^(05|06|07)\d{8}$/;
    const landlineRegex = /^(01|02|03|04|08|09)\d{8}$/;
    
    if (!mobileRegex.test(cleanPhone) && !landlineRegex.test(cleanPhone)) {
      return "رقم الهاتف غير صالح. يجب أن يبدأ بـ: 05, 06, 07 (موبايل) أو 01, 02, 03, 04, 08, 09 (أرضي)";
    }
    
    return undefined;
  };

  const validateBirthdate = (date: string): string | undefined => {
    if (!date) return "تاريخ الميلاد مطلوب";
    
    const selectedDate = new Date(date);
    const currentDate = new Date();
    
    currentDate.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate > currentDate) {
      return "تاريخ الميلاد لا يمكن أن يكون في المستقبل";
    }
    
    const minDate = new Date();
    minDate.setFullYear(currentDate.getFullYear() - 100);
    
    if (selectedDate < minDate) {
      return "الطالب لا يمكن أن يكون عمره أكثر من 100 سنة";
    }
    
    const minAgeDate = new Date();
    minAgeDate.setFullYear(currentDate.getFullYear() - 3);
    
    if (selectedDate > minAgeDate) {
      return "الطالب يجب أن يكون عمره 3 سنوات على الأقل";
    }
    
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors = {
      name: validateName(formData.name),
      contact: validatePhone(formData.contact),
      birthdate: validateBirthdate(formData.birthdate),
    };

    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }
  };

  // Format phone number as user types
  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const limitedDigits = digits.substring(0, 10);
    
    let formatted = limitedDigits;
    if (limitedDigits.length >= 2) {
      if (['05', '06', '07'].includes(limitedDigits.substring(0, 2))) {
        if (limitedDigits.length > 2) {
          formatted = `${limitedDigits.substring(0, 3)} ${limitedDigits.substring(3, 6)}`;
          if (limitedDigits.length > 6) {
            formatted += ` ${limitedDigits.substring(6, 10)}`;
          }
        }
      } else if (limitedDigits.length >= 3) {
        if (limitedDigits.length > 3) {
          formatted = `${limitedDigits.substring(0, 3)} ${limitedDigits.substring(3, 6)}`;
          if (limitedDigits.length > 6) {
            formatted += ` ${limitedDigits.substring(6, 10)}`;
          }
        }
      }
    }
    
    handleChange('contact', formatted);
  };

  // Calculate age from birthdate
  const calculateAge = (birthdate: string): number => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Check for duplicate student - ALL FIELDS MUST MATCH
  const checkForDuplicate = async (): Promise<string | null> => {
    if (!groupId) return "معرف المجموعة غير موجود";
    
    const cleanPhone = formData.contact.replace(/\D/g, '');
    const cleanName = formData.name.trim();
    
    // Check if student with EXACT SAME INFORMATION exists in the group
    const { data: existingStudent, error } = await supabase
      .from("students")
      .select("id, full_name, contact_info, date_of_birth")
      .eq("full_name", cleanName)
      .eq("contact_info", cleanPhone)
      .eq("date_of_birth", formData.birthdate)
      .eq("group_id", Number(groupId))
      .maybeSingle();

    if (error) {
      console.error("Error checking duplicate:", error);
      return "خطأ في التحقق من البيانات المكررة";
    }

    if (existingStudent) {
      // Format the date for display
      const birthDate = new Date(existingStudent.date_of_birth);
      const formattedDate = birthDate.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      return `هذا الطالب مسجل بالفعل في المجموعة بنفس البيانات:
      
الاسم: ${existingStudent.full_name}
الهاتف: ${existingStudent.contact_info}
تاريخ الميلاد: ${formattedDate}`;
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Validate form
    if (!validateForm()) {
      toast({
        title: "خطأ في البيانات",
        description: "الرجاء تصحيح الأخطاء في النموذج",
        variant: "destructive",
      });
      return;
    }

    if (!groupId) {
      setErrors({ general: "معرف المجموعة غير موجود" });
      return;
    }

    // Check for duplicates - ALL FIELDS
    const duplicateError = await checkForDuplicate();
    if (duplicateError) {
      setErrors({ general: duplicateError });
      toast({
        title: "طالب موجود مسبقاً",
        description: "تم العثور على طالب بنفس البيانات في المجموعة",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanPhone = formData.contact.replace(/\D/g, '');
      const cleanName = formData.name.trim();
      
      // Insert student
      const { data, error } = await supabase
        .from("students")
        .insert({
          full_name: cleanName,
          group_id: Number(groupId),
          contact_info: cleanPhone,
          date_of_birth: formData.birthdate,
        })
        .select();

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "تمت الإضافة بنجاح",
        description: `تمت إضافة الطالب ${cleanName} بنجاح`,
      });

      navigate(`/groups/${groupId}`);

    } catch (error: any) {
      console.error("Error adding student:", error);
      
      setErrors({
        general: error.message || "حدث خطأ أثناء حفظ البيانات. حاول مرة أخرى."
      });

      toast({
        title: "حدث خطأ",
        description: error.message || "فشل في إضافة الطالب",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate age for display
  const age = formData.birthdate ? calculateAge(formData.birthdate) : null;

  // Get phone type for display
  const getPhoneType = (phone: string): string => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('05') || cleanPhone.startsWith('06') || cleanPhone.startsWith('07')) {
      return "موبايل";
    } else if (cleanPhone.startsWith('01') || cleanPhone.startsWith('02') || cleanPhone.startsWith('03') || 
               cleanPhone.startsWith('04') || cleanPhone.startsWith('08') || cleanPhone.startsWith('09')) {
      return "أرضي";
    }
    return "";
  };

  const phoneType = formData.contact ? getPhoneType(formData.contact) : "";

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(`/groups/${groupId}`)}
          className="mb-6 flex items-center gap-2"
          disabled={isSubmitting}
        >
          <ArrowRight className="w-4 h-4" />
          <span>رجوع</span>
        </Button>

        <div className="bg-card rounded-xl border border-border p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-2 text-primary">إضافة طالب جديد</h1>
          <p className="text-muted-foreground mb-6">
            أدخل بيانات الطالب الجديد للمجموعة
          </p>

          {errors.general && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="whitespace-pre-line">
                {errors.general}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg">
                اسم الطالب
                <span className="text-destructive mr-1">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="مثال: عبدالله السالم أو Abdullah Al-Salem"
                className={`h-12 text-lg ${errors.name ? 'border-destructive' : ''}`}
                disabled={isSubmitting}
                onBlur={() => {
                  const error = validateName(formData.name);
                  setErrors(prev => ({ ...prev, name: error }));
                }}
                dir="auto"
              />
              {errors.name && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                يمكن إدخال الاسم باللغة العربية أو الإنجليزية
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact" className="text-lg">
                رقم الهاتف
                <span className="text-destructive mr-1">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="مثال: 055 000 1122 أو 011 234 5678"
                  className={`h-12 text-lg ${errors.contact ? 'border-destructive' : ''} pl-14`}
                  disabled={isSubmitting}
                  onBlur={() => {
                    const error = validatePhone(formData.contact);
                    setErrors(prev => ({ ...prev, contact: error }));
                  }}
                  maxLength={12}
                  dir="ltr"
                  inputMode="tel"
                  autoComplete="tel"
                  style={{
                    textAlign: "left",
                    direction: "ltr",
                    unicodeBidi: "bidi-override"
                  }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                </div>
                {phoneType && !errors.contact && (
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {phoneType}
                    </span>
                  </div>
                )}
              </div>
              {errors.contact && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.contact}
                </p>
              )}
              <div className="text-sm text-muted-foreground space-y-1">
                <p>رقم ولي الأمر (10 أرقام)</p>
                <p className="text-xs">
                  موبايل: 05, 06, 07 | أرضي: 01, 02, 03, 04, 08, 09
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthdate" className="text-lg">
                تاريخ الميلاد
                <span className="text-destructive mr-1">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) => handleChange('birthdate', e.target.value)}
                  className={`h-12 text-lg ${errors.birthdate ? 'border-destructive' : ''} pr-12`}
                  disabled={isSubmitting}
                  onBlur={() => {
                    const error = validateBirthdate(formData.birthdate);
                    setErrors(prev => ({ ...prev, birthdate: error }));
                  }}
                  max={new Date().toISOString().split('T')[0]}
                  min={new Date(new Date().getFullYear() - 100, 0, 1).toISOString().split('T')[0]}
                  dir="ltr"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
              {errors.birthdate && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.birthdate}
                </p>
              )}
              {age !== null && !errors.birthdate && (
                <p className="text-sm text-primary font-medium">
                  العمر: {age} سنة
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-6">
              <Button 
                type="submit" 
                className="flex-1 h-12 text-lg font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    جاري الحفظ...
                  </>
                ) : (
                  "حفظ الطالب"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/groups/${groupId}`)}
                className="flex-1 h-12 text-lg"
                disabled={isSubmitting}
              >
                إلغاء
              </Button>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                جميع الحقول المميزة بـ <span className="text-destructive">*</span> إلزامية
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;