import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/app/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Check, X, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/lib/api";

export const Route = createFileRoute("/dashboard/attendance")({
  head: () => ({ meta: [{ title: "Attendance — EduTrack" }] }),
  component: AttendancePage,
});

function AttendancePage() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [status, setStatus] = useState<Record<string, "Present" | "Absent">>(() => ({}));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInitData();
  }, []);

  const fetchInitData = async () => {
    try {
      const [stRes, subRes] = await Promise.all([
        api.get('/teacher/students?limit=100'),
        api.get('/teacher/subjects?limit=50')
      ]);
      setStudents(stRes.data.data);
      setSubjects(subRes.data.data);
      
      const initStatus: Record<string, "Present" | "Absent"> = {};
      stRes.data.data.forEach((s: any) => { initStatus[s._id] = "Present"; });
      setStatus(initStatus);

      if (subRes.data.data.length > 0) setSelectedSubject(subRes.data.data[0]._id);
    } catch (e) {
      toast.error("Failed to load initial data");
    }
  };

  const toggle = (id: string) => setStatus((s) => ({ ...s, [id]: s[id] === "Present" ? "Absent" : "Present" }));

  // Filter students based on the selected subject's class
  const classForSubject = subjects.find(s => s._id === selectedSubject)?.class;
  const targetStudents = students.filter(s => s.class === classForSubject);

  const summary = useMemo(() => {
    if (targetStudents.length === 0) return { present: 0, absent: 0, total: 0, pct: 0 };
    let p = 0;
    targetStudents.forEach(s => { if (status[s._id] === "Present") p++; });
    const total = targetStudents.length;
    return { present: p, absent: total - p, total, pct: Math.round((p / total) * 100) };
  }, [status, targetStudents]);

  const save = async () => {
    if (!selectedSubject) return toast.error("Select a subject first");
    setSaving(true);
    try {
      const promises = targetStudents.map(student => 
        api.post('/teacher/attendance', {
          studentId: student._id,
          subjectId: selectedSubject,
          status: status[student._id],
          date: new Date(date).toISOString()
        })
      );
      await Promise.all(promises);
      toast.success("Attendance saved and broadcasted");
    } catch (e) {
      toast.error("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Attendance">
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border/60 sm:col-span-1"><CardContent className="p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="h-4 w-4" />Date</div>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-2" />
        </CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-5"><div className="text-xs text-muted-foreground">Subject Class</div><div className="mt-1 text-2xl font-bold">{classForSubject || "-"}</div></CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-5"><div className="text-xs text-muted-foreground">Present</div><div className="mt-1 text-2xl font-bold text-success">{summary.present}</div></CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-5"><div className="text-xs text-muted-foreground">Attendance</div><div className="mt-1 text-2xl font-bold">{summary.pct}%</div></CardContent></Card>
      </div>

      <Card className="mt-6 border-border/60">
        <CardContent className="p-6">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold whitespace-nowrap">Mark attendance</h3>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select Subject" /></SelectTrigger>
                <SelectContent>
                  {subjects.map(sub => (
                    <SelectItem key={sub._id} value={sub._id}>{sub.name} ({sub.class})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={save} disabled={saving || !selectedSubject}>{saving ? "Saving..." : "Save"}</Button>
          </div>
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Roll</TableHead><TableHead>Name</TableHead><TableHead>Class</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {targetStudents.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No students in this class</TableCell></TableRow>
                ) : targetStudents.map((s) => {
                  const present = status[s._id] === "Present";
                  return (
                    <TableRow key={s._id}>
                      <TableCell>{s.rollNumber}</TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.class}</TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={() => toggle(s._id)}
                          className={cn(
                            "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-all",
                            present ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                          )}
                        >
                          {present ? <><Check className="h-3.5 w-3.5" />Present</> : <><X className="h-3.5 w-3.5" />Absent</>}
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}