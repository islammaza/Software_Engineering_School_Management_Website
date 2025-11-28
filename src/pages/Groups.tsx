import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Users, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/database/supabaseClient";

interface Group {
  id: string;
  name: string;
  professor_name: string;
  timing: string;
}

const Groups = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      const { data, error } = await supabase.from("groups").select("*");
      if (error) console.error(error);
      else setGroups(data);
    };
    fetchGroups();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8 md:space-y-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-black text-gradient-durar mb-4 md:mb-6">
            الحلقات والمجموعات
          </h1>
        </div>

        <div className="flex justify-end">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-[var(--gold)] text-white shadow-xl"
            onClick={() => navigate("/groups/add")}
          >
            <Plus className="w-5 h-5 ml-2" />
            إضافة مجموعة جديدة
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-10">
          {groups.map((group) => (
            <div
              key={group.id}
              onClick={() => navigate(`/groups/${group.id}`)}
              className="group cursor-pointer glass-card rounded-3xl p-6 border border-[var(--gold)]/30 text-center hover:scale-105 transition-all"
            >
              <Users className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-black text-gradient-durar mb-3">
                {group.name}
              </h3>
              <p className="text-base text-muted-foreground mb-6">
                {group.professor_name}
              </p>
              <p className="text-lg font-bold text-primary">
                <Clock className="inline w-5 h-5 mr-2" />
                {group.timing}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Groups;
