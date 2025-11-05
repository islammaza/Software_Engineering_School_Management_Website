import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, Plus, Edit, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const StudentDetails = () => {
  const navigate = useNavigate();
  const { groupId, studentId } = useParams();
  const { toast } = useToast();
  
  const [student] = useState({
    id: studentId,
    name: "عبدالله بن محمد",
    generalNotes: "أضف ملاحظة عامة عن أداء الطالب...",
    progress: [
      { 
        id: 1,
        unit: "سورة البقرة", 
        progress: "3/4 جزء", 
        date: "2023-10-27", 
        notes: "أداء جيد يحتاج لمراجعة المتشابهات",
        progressBar: 75
      },
      { 
        id: 2,
        unit: "التجويد", 
        progress: "85/100", 
        date: "2023-10-25", 
        notes: "ممتاز في أحكام النون الساكنة",
        progressBar: 85
      },
      { 
        id: 3,
        unit: "سورة آل عمران", 
        progress: "1/2 جزء", 
        date: "2023-11-05", 
        notes: "يحتاج موضعة",
        progressBar: 50
      },
    ],
  });

  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [editingGeneral, setEditingGeneral] = useState(false);
  const [addingProgress, setAddingProgress] = useState(false);
  const [generalNotes, setGeneralNotes] = useState(student.generalNotes);
  const [editedNoteData, setEditedNoteData] = useState({
    unit: "",
    progress: "",
    date: "",
    notes: "",
  });

  const [newProgress, setNewProgress] = useState({
    unit: "",
    progress: "",
    date: "",
    notes: "",
  });

  const calculateAverage = () => {
    const total = student.progress.reduce((sum, item) => {
      if (item.progress.includes("/")) {
        const [current, max] = item.progress.split("/").map(n => parseInt(n.trim()));
        return sum + (current / max) * 100;
      }
      return sum + parseInt(item.progress);
    }, 0);
    return Math.round(total / student.progress.length);
  };

  const handleSaveGeneralNotes = () => {
    toast({
      title: "تم الحفظ",
      description: "تم حفظ الملاحظات العامة بنجاح",
    });
    setEditingGeneral(false);
  };

  const handleAddProgress = () => {
    toast({
      title: "تم الإضافة",
      description: "تمت إضافة ملاحظة جديدة بنجاح",
    });
    setAddingProgress(false);
    setNewProgress({ unit: "", progress: "", date: "", notes: "" });
  };

  const handleSaveEdit = () => {
    toast({
      title: "تم الحفظ",
      description: "تم حفظ التعديلات بنجاح",
    });
    setEditingNote(null);
  };

  const handleExportPDF = () => {
    toast({
      title: "تصدير PDF",
      description: "جاري تصدير البيانات إلى PDF...",
    });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/groups/${groupId}`)}
            className="rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold mb-1">{student.name}</h1>
            <p className="text-sm text-muted-foreground">
              المجموعة: حلقة القرآن  •  تقدم الحفظ: 4 جزء
            </p>
          </div>
          
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Add Progress Form */}
          {addingProgress && (
            <div className="bg-secondary/30 p-6 rounded-lg space-y-4 mb-6">
              <h3 className="font-bold">إضافة ملاحظة جديدة</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>الوحدة</Label>
                  <Input
                    value={newProgress.unit}
                    onChange={(e) => setNewProgress({ ...newProgress, unit: e.target.value })}
                    placeholder="مثال: سورة البقرة"
                  />
                </div>
                <div className="space-y-2">
                  <Label>التقدم</Label>
                  <Input
                    value={newProgress.progress}
                    onChange={(e) => setNewProgress({ ...newProgress, progress: e.target.value })}
                    placeholder="مثال: 3/5 جزء"
                  />
                </div>
                <div className="space-y-2">
                  <Label>التاريخ</Label>
                  <Input
                    type="date"
                    value={newProgress.date}
                    onChange={(e) => setNewProgress({ ...newProgress, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>الملاحظات</Label>
                  <Textarea
                    value={newProgress.notes}
                    onChange={(e) => setNewProgress({ ...newProgress, notes: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddProgress}>حفظ</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAddingProgress(false);
                      setNewProgress({ unit: "", progress: "", date: "", notes: "" });
                    }}
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Progress Table */}
          <div className="bg-secondary/10 rounded-xl overflow-hidden mb-6">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-secondary/30 font-semibold text-sm">
              <div className="text-center">تاريخ آخر تقييم</div>
              <div className="text-center">ملاحظة</div>
              <div className="text-center">الدرجة / الحزب المسجل</div>
              <div className="text-center">اسم الوحدة</div>
            </div>

            {/* Table Rows */}
            {student.progress.map((item) => (
              <div key={item.id}>
                {editingNote === item.id ? (
                  <div className="p-6 border-t border-border bg-background space-y-4">
                    <div className="space-y-2">
                      <Label>الوحدة</Label>
                      <Input 
                        defaultValue={item.unit}
                        onChange={(e) => setEditedNoteData({ ...editedNoteData, unit: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>التقدم</Label>
                      <Input 
                        defaultValue={item.progress}
                        onChange={(e) => setEditedNoteData({ ...editedNoteData, progress: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>التاريخ</Label>
                      <Input 
                        type="date" 
                        defaultValue={item.date}
                        onChange={(e) => setEditedNoteData({ ...editedNoteData, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>الملاحظات</Label>
                      <Textarea 
                        defaultValue={item.notes} 
                        rows={3}
                        onChange={(e) => setEditedNoteData({ ...editedNoteData, notes: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveEdit}>حفظ</Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingNote(null)}
                      >
                        إلغاء
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4 p-4 border-t border-border hover:bg-secondary/5 transition-colors group">
                    <div className="text-center text-sm text-muted-foreground flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                        onClick={() => setEditingNote(item.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {item.date}
                    </div>
                    <div className="text-center text-sm text-muted-foreground flex items-center justify-center">
                      {item.notes}
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-full max-w-[120px] space-y-1">
                        <div className="text-sm font-medium text-center">{item.progress}</div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${item.progressBar}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-center font-medium flex items-center justify-center">
                      {item.unit}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* General Notes Section */}
          <div className="space-y-4">
            <h3 className="font-bold text-right">ملاحظة عامة</h3>
            {editingGeneral ? (
              <div className="space-y-4">
                <Textarea
                  value={generalNotes}
                  onChange={(e) => setGeneralNotes(e.target.value)}
                  rows={4}
                  className="w-full"
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveGeneralNotes}>حفظ</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setGeneralNotes(student.generalNotes);
                      setEditingGeneral(false);
                    }}
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            ) : (
              <div 
                className="bg-secondary/10 p-4 rounded-lg text-sm text-muted-foreground text-right cursor-pointer hover:bg-secondary/20 transition-colors"
                onClick={() => setEditingGeneral(true)}
              >
                {generalNotes}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-secondary/5">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleExportPDF}
          >
            <FileDown className="w-4 h-4" />
            تصدير PDF
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">المتوسط</span>
              <span className="text-2xl font-bold">{calculateAverage()}/100</span>
            </div>
            <Button  className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              حساب المتوسط
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;