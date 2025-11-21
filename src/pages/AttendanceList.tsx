// src/pages/AttendanceList.tsx
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Save, X, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type Status = "present" | "late" | "absent" | "excused";

interface Session {
  id: number;
  date: string;
}

interface StudentAttendance {
  studentId: number;
  studentName: string;
  sessions: Status[];
}

const AttendanceList = () => {
  const { toast } = useToast();
  const [selectedGroup, setSelectedGroup] = useState("furqan");
  const [newSessionDate, setNewSessionDate] = useState("");
  const [editingCell, setEditingCell] = useState<{ studentId: number; sessionId: number } | null>(null);
  const [tempStatus, setTempStatus] = useState<Status>("present");

  const groups = {
    furqan: "مجموعة الفرقان",
    noor: "مجموعة النور",
    ihsan: "مجموعة الإحسان",
  };

  const [sessions, setSessions] = useState<Session[]>([
    { id: 1, date: "21 نوفمبر" },
    { id: 2, date: "20 نوفمبر" },
    { id: 3, date: "19 نوفمبر" },
    { id: 4, date: "18 نوفمبر" },
    { id: 5, date: "17 نوفمبر" },
    { id: 6, date: "16 نوفمبر" },
    { id: 7, date: "15 نوفمبر" },
    { id: 8, date: "14 نوفمبر" },
    { id: 9, date: "13 نوفمبر" },
    { id: 10, date: "12 نوفمبر" },
  ]);

  const groupData: Record<string, StudentAttendance[]> = {
    furqan: [
      { studentId: 1, studentName: "عبد الرحمن بن صالح", sessions: ["present","present","present","present","present","present","present","present","present","present"] },
      { studentId: 2, studentName: "فاطمة الزهراء", sessions: ["present","present","present","present","present","present","present","present","present","present"] },
      { studentId: 3, studentName: "يوسف بن علي", sessions: ["present","present","late","present","present","present","present","present","present","late"] },
      { studentId: 4, studentName: "خديجة بنت محمد", sessions: ["present","present","present","present","present","present","present","present","present","present"] },
      { studentId: 5, studentName: "عمر بن الخطاب", sessions: ["absent","present","present","late","present","present","present","present","absent","present"] },
    ],
    noor: [
      { studentId: 6, studentName: "زينب بنت جحش", sessions: ["present","present","present","present","present","present","present","present","present","present"] },
    ],
    ihsan: [
      { studentId: 8, studentName: "سليمان القريشي", sessions: ["present","present","late","present","present","present","present","present","present","present"] },
    ],
  };

  const [data, setData] = useState(groupData[selectedGroup] || []);

  const handleGroupChange = (value: string) => {
    setSelectedGroup(value);
    setData(groupData[value] || []);
  };

  const handleAddSession = () => {
    if (!newSessionDate.trim()) return;
    const newSession: Session = { id: sessions.length + 1, date: newSessionDate };
    setSessions([newSession, ...sessions]);
    setData(prev => prev.map(s => ({ ...s, sessions: ["present", ...s.sessions] })));
    setNewSessionDate("");
    toast({ title: "تمت الإضافة", description: `تم إضافة جلسة ${newSessionDate}` });
  };

  const handleEditCell = (studentId: number, sessionId: number, currentStatus: Status) => {
    setEditingCell({ studentId, sessionId });
    setTempStatus(currentStatus);
  };

  const handleSaveCell = (studentId: number, sessionId: number) => {
    setData(prev =>
      prev.map(student =>
        student.studentId === studentId
          ? {
              ...student,
              sessions: student.sessions.map((s, i) => (i + 1 === sessionId ? tempStatus : s)),
            }
          : student
      )
    );
    setEditingCell(null);
    toast({ title: "تم الحفظ", description: "تم تحديث حالة الحضور" });
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case "present": return <CheckCircle2 className="w-8 h-8 text-green-600" />;
      case "late": return <Clock className="w-8 h-8 text-amber-600" />;
      case "absent": return <XCircle className="w-8 h-8 text-red-600" />;
      case "excused": return <Badge className="bg-purple-100 text-purple-700 px-4 py-2 text-sm font-bold">معذور</Badge>;
      default: return null;
    }
  };

  const calculateAttendanceRate = (sessions: Status[]) => {
    const present = sessions.filter(s => s === "present" || s === "late").length;
    return Math.round((present / sessions.length) * 100);
  };

  return (
    <DashboardLayout>
      {/* الهيرو + اختيار المجموعة + إضافة جلسة – ثابت تمامًا */}
      <div className="sticky top-0 z-40 bg-white border-b border-border shadow-lg">
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-6xl font-black text-gradient-durar mb-8">
            سجل الحضور الكامل
          </h1>
          <Select value={selectedGroup} onValueChange={handleGroupChange}>
            <SelectTrigger className="w-full max-w-md mx-auto text-2xl font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="furqan">مجموعة الفرقان</SelectItem>
              <SelectItem value="noor">مجموعة النور</SelectItem>
              <SelectItem value="ihsan">مجموعة الإحسان</SelectItem>
            </SelectContent>
          </Select>
          <div className="w-full h-3 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-70 my-12" />
          <div className="flex justify-center gap-4">
            <Input
              placeholder="أدخل تاريخ الجلسة الجديدة (مثال: 22 نوفمبر)"
              value={newSessionDate}
              onChange={(e) => setNewSessionDate(e.target.value)}
              className="w-96 text-xl"
            />
            <Button onClick={handleAddSession} className="bg-primary hover:bg-primary/90 text-xl px-8">
              <Plus className="w-6 h-6 ml-3" />
              إضافة جلسة
            </Button>
          </div>
        </div>
      </div>

      {/* الجدول – يتمرر لوحده فقط */}
      <div className="flex-1 overflow-hidden bg-gray-50">
        <div className="h-full overflow-auto">
          <table className="w-full min-w-max">
            <thead className="sticky top-0 bg-white border-b-2 border-primary z-20 shadow-md">
              <tr>
                <th className="text-right p-6 text-xl font-bold sticky left-0 bg-white z-30">الطالب</th>
                {sessions.map((session) => (
                  <th key={session.id} className="text-center p-6 text-lg font-bold min-w-32">
                    {session.date}
                  </th>
                ))}
                <th className="text-center p-6 text-xl font-bold sticky right-0 bg-white z-30">
                  المتوسط
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((student) => {
                const rate = calculateAttendanceRate(student.sessions);
                return (
                  <tr key={student.studentId} className="border-b border-border/20 hover:bg-primary/5">
                    <td className="p-6 text-lg text-right font-bold sticky left-0 bg-white z-20">
                      {student.studentName}
                    </td>
                    {student.sessions.map((status, index) => (
                      <td key={index} className="p-4 text-center">
                        {editingCell?.studentId === student.studentId && editingCell?.sessionId === index + 1 ? (
                          <div className="flex justify-center items-center gap-2">
                            <Select value={tempStatus} onValueChange={(v) => setTempStatus(v as Status)}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="present">حاضر</SelectItem>
                                <SelectItem value="late">متأخر</SelectItem>
                                <SelectItem value="absent">غائب</SelectItem>
                                <SelectItem value="excused">معذور</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button size="icon" onClick={() => handleSaveCell(student.studentId, index + 1)} className="bg-green-600 hover:bg-green-700">
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="outline" onClick={() => setEditingCell(null)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer p-3 rounded-lg hover:bg-primary/10 transition-all"
                            onClick={() => handleEditCell(student.studentId, index + 1, status)}
                          >
                            {getStatusIcon(status)}
                          </div>
                        )}
                      </td>
                    ))}
                    <td className="p-6 text-center sticky right-0 bg-white z-20">
                      <span className={`text-3xl font-black ${rate >= 95 ? "text-green-600" : rate >= 80 ? "text-amber-600" : "text-red-600"}`}>
                        {rate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AttendanceList;