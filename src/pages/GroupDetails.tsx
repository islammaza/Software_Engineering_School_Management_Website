import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/database/supabaseClient";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  fullname: string;
}

interface Module {
  id: string;
  name: string;
  description: string;
}

const GroupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [group, setGroup] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Group
      const { data: groupData, error: groupError } = await supabase
        .from("groups")
        .select("*")
        .eq("id", id)
        .single();
      if (groupError) console.error(groupError);
      else setGroup(groupData);

      // Students
      const { data: studentsData } = await supabase
        .from("students")
        .select("*")
        .eq("group_id", id);
      setStudents(studentsData || []);

      // Modules
      const { data: modulesData } = await supabase
        .from("modules")
        .select("*")
        .eq("group_id", id);
      setModules(modulesData || []);
    };

    fetchData();
  }, [id]);

  const handleDeleteStudent = async (studentId: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الطالب؟")) return;
    const { error } = await supabase.from("students").delete().eq("id", studentId);
    if (error) toast({ title: "خطأ", description: error.message });
    else setStudents(students.filter((s) => s.id !== studentId));
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الوحدة؟")) return;
    const { error } = await supabase.from("modules").delete().eq("id", moduleId);
    if (error) toast({ title: "خطأ", description: error.message });
    else setModules(modules.filter((m) => m.id !== moduleId));
  };

  if (!group) return <p>Loading...</p>;

  return (
    <DashboardLayout>
      <div className="space-y-12 py-12 px-4 sm:px-6 lg:px-8">
        <Button onClick={() => navigate("/groups")} variant="outline">
          <ArrowLeft className="w-6 h-6 ml-3" /> رجوع إلى قائمة الحلقات
        </Button>

        <h1 className="text-5xl font-black text-center mb-4">{group.name}</h1>
        <p className="text-2xl text-center mb-12">المعلم: {group.professor_name}</p>

        <div>
          <h2 className="text-4xl font-black mb-6">الطلاب</h2>
          {students.map((s) => (
            <div key={s.id} className="flex justify-between p-4 border rounded mb-2">
              {s.fullname}
              <Button size="sm" onClick={() => handleDeleteStudent(s.id)}>
                <Trash2 /> حذف
              </Button>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-4xl font-black mb-6">الوحدات</h2>
          {modules.map((m) => (
            <Card key={m.id} className="p-4 mb-2 flex justify-between">
              <div>
                <h3 className="font-bold">{m.name}</h3>
                <p>{m.description}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleDeleteModule(m.id)}>
                  <Trash2 /> حذف
                </Button>
                <Button size="sm" onClick={() => navigate(`/groups/${id}/modules/${m.id}/edit`)}>
                  <Edit /> تعديل
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GroupDetails;
