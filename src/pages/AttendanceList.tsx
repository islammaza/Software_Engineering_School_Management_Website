import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Save, X, CheckCircle2, XCircle, Clock, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

const Attendance = () => {
  const [selectedGroup, setSelectedGroup] = useState("furqan");
  const [newSessionDate, setNewSessionDate] = useState("");
  const [editingCell, setEditingCell] = useState<{ studentId: number; sessionId: number } | null>(null);
  const [tempStatus, setTempStatus] = useState<Status>("present");

  const [sessions, setSessions] = useState<Session[]>([
    { id: 1, date: "2025-11-21" },
    { id: 2, date: "2025-11-20" },
    { id: 3, date: "2025-11-19" },
    { id: 4, date: "2025-11-18" },
    { id: 5, date: "2025-11-17" },
    { id: 6, date: "2025-11-16" },
  ]);

  const groupData: Record<string, StudentAttendance[]> = {
    furqan: [
      { studentId: 1, studentName: "عبد الرحمن بن صالح", sessions: ["present","present","present","present","present","present"] },
      { studentId: 2, studentName: "فاطمة الزهراء", sessions: ["present","present","present","present","present","present"] },
      { studentId: 3, studentName: "يوسف بن علي", sessions: ["present","present","late","present","present","present"] },
      { studentId: 4, studentName: "خديجة بنت محمد", sessions: ["present","present","present","present","present","present"] },
      { studentId: 5, studentName: "عمر بن الخطاب", sessions: ["absent","present","present","late","present","present"] },
    ],
    noor: [
      { studentId: 6, studentName: "زينب بنت جحش", sessions: ["present","present","present","present","present","present"] },
    ],
    ihsan: [
      { studentId: 8, studentName: "سليمان القريشي", sessions: ["present","present","late","present","present","present"] },
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
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case "present": return <CheckCircle2 className="w-8 h-8 text-green-600" />;
      case "late": return <Clock className="w-8 h-8 text-amber-600" />;
      case "absent": return <XCircle className="w-8 h-8 text-red-600" />;
      case "excused": return <span className="bg-purple-100 text-purple-700 px-3 py-1 text-xs font-bold rounded">معذور</span>;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8 pb-16">
        {/* Header Section */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 mb-4 md:mb-6">
            <FileCheck2 className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gradient-durar mb-3 md:mb-4">
            سجل الحضور والغياب
          </h1>
          <p className="text-base md:text-2xl text-muted-foreground">
            متابعة حضور الطلاب وتسجيل الغيابات
          </p>
          <div className="w-full h-1 md:h-2 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-70 my-6 md:my-8" />
        </div>

        {/* Controls Section */}
        <Card className="glass-card p-4 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            <div className="w-full md:w-auto">
              <label className="block text-sm md:text-lg font-bold mb-2">اختر المجموعة</label>
              <select 
                value={selectedGroup} 
                onChange={(e) => handleGroupChange(e.target.value)}
                className="w-full md:min-w-[250px] px-4 md:px-6 py-2 md:py-3 text-sm md:text-lg font-semibold border-2 border-primary rounded-xl bg-background transition-all hover:border-primary/70 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="furqan">مجموعة الفرقان</option>
                <option value="noor">مجموعة النور</option>
                <option value="ihsan">مجموعة الإحسان</option>
              </select>
            </div>

            <div className="w-full md:w-auto">
              <label className="block text-sm md:text-lg font-bold mb-2">إضافة جلسة جديدة</label>
              <div className="flex gap-2 md:gap-3">
                <input
                  type="date"
                  value={newSessionDate}
                  onChange={(e) => setNewSessionDate(e.target.value)}
                  className="flex-1 md:flex-none px-3 md:px-4 py-2 md:py-3 text-xs md:text-base border-2 border-primary rounded-xl bg-background transition-all focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <Button 
                  onClick={handleAddSession}
                  disabled={!newSessionDate}
                  size="sm"
                  className="text-xs md:text-lg px-2 md:px-4"
                >
                  <Plus className="w-4 h-4 md:w-5 md:h-5 ml-1 md:ml-2" />
                  <span className="hidden sm:inline">إضافة جلسة</span>
                  <span className="sm:hidden">إضافة</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Attendance Table */}
        <Card className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead className="bg-primary/5 border-b-2 border-primary">
                <tr>
                  <th className="text-right p-2 md:p-6 text-sm md:text-xl font-bold min-w-[120px] md:min-w-[250px] sticky right-0 bg-primary/5 z-10">
                    الطالب
                  </th>
                  {sessions.map((session) => (
                    <th key={session.id} className="text-center p-2 md:p-4 text-xs md:text-base font-bold min-w-[90px] md:min-w-[140px]">
                      <span className="text-xs block mb-1">{formatDate(session.date)}</span>
                    </th>
                  ))}
                  <th className="text-center p-2 md:p-6 text-sm md:text-xl font-bold min-w-[80px] md:min-w-[150px] sticky left-0 bg-primary/5 z-10">
                    النسبة
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((student, studentIndex) => {
                  const presentCount = student.sessions.filter(s => s === "present" || s === "late").length;
                  const totalSessions = student.sessions.length;
                  const rate = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;
                  
                  return (
                    <tr 
                      key={student.studentId} 
                      className={`border-b border-border/50 hover:bg-primary/5 transition-colors ${
                        studentIndex % 2 === 0 ? 'bg-muted/20' : ''
                      }`}
                    >
                      <td className="p-2 md:p-6 text-sm md:text-xl font-bold text-right sticky right-0 bg-background z-10 truncate">
                        {student.studentName}
                      </td>
                      {student.sessions.map((status, index) => (
                        <td key={index} className="p-1 md:p-3 text-center">
                          {editingCell?.studentId === student.studentId && editingCell?.sessionId === index + 1 ? (
                            <div className="flex justify-center items-center gap-1 md:gap-2 flex-col md:flex-row">
                              <select 
                                value={tempStatus} 
                                onChange={(e) => setTempStatus(e.target.value as Status)}
                                className="px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm border-2 border-primary rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                              >
                                <option value="present">حاضر</option>
                                <option value="late">متأخر</option>
                                <option value="absent">غائب</option>
                                <option value="excused">معذور</option>
                              </select>
                              <button 
                                onClick={() => handleSaveCell(student.studentId, index + 1)}
                                className="bg-primary hover:bg-primary/90 text-white h-7 md:h-9 w-7 md:w-9 p-0 rounded-lg flex items-center justify-center transition-all"
                              >
                                <Save className="w-3 md:w-4 h-3 md:h-4" />
                              </button>
                              <button 
                                onClick={() => setEditingCell(null)}
                                className="h-9 w-9 p-0 border-2 border-border rounded-lg hover:bg-muted flex items-center justify-center transition-all"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div
                              className="cursor-pointer p-3 rounded-xl hover:bg-primary/10 transition-all inline-flex justify-center"
                              onClick={() => handleEditCell(student.studentId, index + 1, status)}
                              title={`انقر للتعديل: ${status}`}
                            >
                              {getStatusIcon(status)}
                            </div>
                          )}
                        </td>
                      ))}
                      <td className="p-6 text-center sticky left-0 bg-background z-10">
                        <div className="text-center">
                          <span className={`text-4xl font-black ${
                            rate >= 95 ? "text-green-600" : 
                            rate >= 80 ? "text-amber-600" : 
                            "text-red-600"
                          }`}>
                            {rate}%
                          </span>
                          <p className="text-sm text-muted-foreground font-bold mt-2">
                            {presentCount}/{totalSessions} جلسة
                          </p>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Legend */}
        <Card className="glass-card p-4 md:p-8">
          <h3 className="text-lg md:text-2xl font-bold mb-4 md:mb-6 text-center">دليل الرموز</h3>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 md:gap-8">
            <div className="flex items-center gap-2 md:gap-3">
              <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-green-600 flex-shrink-0" />
              <span className="text-sm md:text-lg font-bold">حاضر</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <Clock className="w-6 h-6 md:w-8 md:h-8 text-amber-600 flex-shrink-0" />
              <span className="text-sm md:text-lg font-bold">متأخر</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <XCircle className="w-6 h-6 md:w-8 md:h-8 text-red-600 flex-shrink-0" />
              <span className="text-sm md:text-lg font-bold">غائب</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <span className="bg-purple-100 text-purple-700 px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm font-bold rounded-lg whitespace-nowrap">معذور</span>
              <span className="text-sm md:text-lg font-bold">معذور</span>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;