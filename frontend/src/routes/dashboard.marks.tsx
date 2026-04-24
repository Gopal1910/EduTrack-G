import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/app/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/api";

export const Route = createFileRoute("/dashboard/marks")({
  head: () => ({ meta: [{ title: "Marks — EduTrack" }] }),
  component: MarksPage,
});

function gradeFor(pct: number) {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct > 0) return "F";
  return "-";
}

function MarksPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [marks, setMarks] = useState<Record<string, Record<string, number>>>(() => ({}));
  const [saving, setSaving] = useState(false);
  const [tgtClass, setTgtClass] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stRes, subRes, mrkRes] = await Promise.all([
        api.get('/teacher/students?limit=200'),
        api.get('/teacher/subjects?limit=50'),
        api.get('/teacher/marks')
      ]);

      setStudents(stRes.data.data);
      setSubjects(subRes.data.data);

      const m: Record<string, Record<string, number>> = {};
      mrkRes.data.forEach((mrk: any) => {
        if (!m[mrk.student]) m[mrk.student] = {};
        m[mrk.student][mrk.subject] = mrk.marksObtained;
      });
      setMarks(m);
      
      const distinctClasses: string[] = Array.from(new Set(subRes.data.data.map((x: any) => x.class)));
      if (distinctClasses.length > 0) setTgtClass(distinctClasses[0]);
    } catch (e) {
      toast.error("Failed to fetch records");
    }
  };

  const setMark = (studentId: string, subjectId: string, v: number) =>
    setMarks((m) => ({ ...m, [studentId]: { ...m[studentId], [subjectId]: v } }));

  const filterSub = subjects.filter(s => s.class === tgtClass);
  const filterSt = students.filter(s => s.class === tgtClass);
  const maxTotal = filterSub.reduce((a, s) => a + (s.totalMarks || 100), 0);

  const save = async () => {
    setSaving(true);
    try {
      const reqs: any[] = [];
      filterSt.forEach(s => {
        filterSub.forEach(sub => {
          if (marks[s._id]?.[sub._id] !== undefined) {
            reqs.push(api.post('/teacher/marks', {
              studentId: s._id,
              subjectId: sub._id,
              examType: "Final",
              marksObtained: marks[s._id][sub._id],
              totalMarks: sub.totalMarks || 100
            }));
          }
        });
      });
      await Promise.all(reqs);
      toast.success("Marks saved and broadcasted to students!");
    } catch (e) {
      toast.error("Failed to commit marks");
    } finally {
      setSaving(false);
    }
  };

  const classes = Array.from(new Set(subjects.map((x: any) => x.class)));

  return (
    <DashboardLayout title="Marks Management">
      <Card className="border-border/60">
        <CardContent className="p-6">
          <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="font-semibold">Subject-wise marks</h3>
                <p className="text-xs text-muted-foreground">Select a class to filter subjects and calculate totals automatically.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={tgtClass} onValueChange={setTgtClass}>
                <SelectTrigger className="w-32"><SelectValue placeholder="Class" /></SelectTrigger>
                <SelectContent>
                  {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Student</TableHead>
                {filterSub.map((s) => <TableHead key={s._id}>{s.name} ({s.totalMarks || 100})</TableHead>)}
                <TableHead>Total</TableHead>
                <TableHead>%</TableHead>
                <TableHead>Grade</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filterSt.length === 0 ? <TableRow><TableCell colSpan={filterSub.length + 4} className="py-8 text-center text-muted-foreground">No students in this class</TableCell></TableRow> : null}
                {filterSt.map((s) => {
                  const obtained = filterSub.reduce((a, sub) => a + (marks[s._id]?.[sub._id] ?? 0), 0);
                  const pct = maxTotal > 0 ? Math.round((obtained / maxTotal) * 100) : 0;
                  const grade = gradeFor(pct);
                  return (
                    <TableRow key={s._id}>
                      <TableCell className="font-medium whitespace-nowrap">{s.name}<div className="text-xs text-muted-foreground">{s.rollNumber} · {s.class}</div></TableCell>
                      {filterSub.map((sub) => (
                        <TableCell key={sub._id}>
                          <Input
                            type="number"
                            value={marks[s._id]?.[sub._id] ?? ""}
                            placeholder="-"
                            onChange={(e) => setMark(s._id, sub._id, Math.max(0, Math.min(sub.totalMarks || 100, Number(e.target.value))))}
                            className="h-8 w-20"
                          />
                        </TableCell>
                      ))}
                      <TableCell>{obtained}/{maxTotal}</TableCell>
                      <TableCell>{pct}%</TableCell>
                      <TableCell>
                        <Badge variant={grade === "A" ? "default" : grade === "F" ? "destructive" : "secondary"}>{grade}</Badge>
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