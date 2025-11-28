// src/pages/GroupDetails.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Edit, Trash2, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Student { id: string; name: string; }
interface Module { id: string; title: string; description: string; }
interface Group { id: string; name: string; professor_name: string; }

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [group, setGroup] = useState<Group | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await fetch(`http://localhost:5000/groups/${id}`);
        const data = await res.json();
        setGroup(data);
      } catch (err) { console.error(err); }
    };
    fetchGroup();
  }, [id]);

  // students/modules are still placeholders
  useEffect(() => {
    setStudents([
      { id: "1", name: "عبد الرحمن بن صالح" },
      { id: "2", name: "فاطمة الزهراء" },
      { id: "3", name: "يوسف بن علي" },
    ]);
    setModules([
      { id: "1", title: "سورة البقرة", description: "حفظ من الآية 1 إلى 141" },
      { id: "2", title: "التجويد", description: "أحكام النون والميم والمدود" },
    ]);
  }, []);

  if (!group) return <p>Loading...</p>;

  return (
    <DashboardLayout>
      <div className="space-y-12 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Button
            onClick={() => navigate("/groups")}
            variant="outline"
            size="lg"
            className="mb-8 border-primary text-primary hover:bg-primary hover:text-white text-lg px-10 py-6 shadow-lg"
          >
            <ArrowLeft className="w-6 h-6 ml-3" />
            رجوع إلى قائمة الحلقات
          </Button>
        </div>

        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-black text-gradient-durar mb-4">
            {group.name}
          </h1>
          <p className="text-2xl sm:text-3xl text-[var(--gold)] font-bold">
            المعلم: {group.professor_name}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" onClick={() => navigate(`/groups/${id}/students/add`)}>
            <Plus className="w-5 h-5 ml-2" /> إضافة طالب
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate(`/groups/${id}/edit`)}
            className="border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black"
          >
            <Edit className="w-5 h-5 ml-2" /> تعديل المجموعة
          </Button>
        </div>

        {/* Students & Modules placeholders */}
      </div>
    </DashboardLayout>
  );
};

export default GroupDetails;
