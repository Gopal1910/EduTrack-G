import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/app/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

export const Route = createFileRoute("/dashboard/subjects")({
  head: () => ({ meta: [{ title: "Subjects — EduTrack" }] }),
  component: SubjectsPage,
});

export type BackendSubject = {
  _id: string;
  name: string;
  code: string;
  class: string;
  totalMarks: number;
  attendanceWeight: number;
};

function SubjectsPage() {
  const [subjects, setSubjects] = useState<BackendSubject[]>([]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ name: "", code: "", class: "", totalMarks: 100, attendanceWeight: 10 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/teacher/subjects?limit=50');
      setSubjects(res.data.data);
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.message || "Failed to load subjects");
    } finally {
      setLoading(false);
    }
  }

  const add = async () => {
    if (!draft.name || !draft.code || !draft.class) return toast.error("Name, code and class are required");
    
    try {
      const res = await api.post('/teacher/subjects', draft);
      setSubjects((l) => [...l, res.data]);
      setDraft({ name: "", code: "", class: "", totalMarks: 100, attendanceWeight: 10 });
      setOpen(false);
      toast.success("Subject added");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to add subject");
    }
  };

  const removeSub = async (id: string) => {
    try {
      await api.delete(`/teacher/subjects/${id}`);
      setSubjects((l) => l.filter((x) => x._id !== id));
      toast.success("Removed");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to delete subject");
    }
  };

  return (
    <DashboardLayout title="Subjects">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Configure subjects, total marks and attendance weightage.</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" />New subject</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New subject</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Subject name</Label>
                  <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Biology" />
                </div>
                <div className="space-y-2">
                  <Label>Subject code</Label>
                  <Input value={draft.code} onChange={(e) => setDraft({ ...draft, code: e.target.value })} placeholder="e.g. BIO101" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Class</Label>
                <Input value={draft.class} onChange={(e) => setDraft({ ...draft, class: e.target.value })} placeholder="e.g. 10th A" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Total marks</Label>
                  <Input type="number" value={draft.totalMarks} onChange={(e) => setDraft({ ...draft, totalMarks: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Attendance %</Label>
                  <Input type="number" value={draft.attendanceWeight} onChange={(e) => setDraft({ ...draft, attendanceWeight: Number(e.target.value) })} />
                </div>
              </div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={add}>Add</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="text-sm text-muted-foreground py-10 w-full col-span-full text-center">Loading subjects...</div>
        ) : subjects.length === 0 ? (
          <div className="text-sm text-muted-foreground py-10 w-full col-span-full text-center border rounded-lg bg-muted/20">No subjects configured. Add one above.</div>
        ) : null}

        {subjects.map((s) => (
          <Card key={s._id} className="border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeSub(s._id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="mt-4 flex items-center gap-2 font-semibold">
                <h3>{s.name}</h3>
                <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">{s.code}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{s.class}</p>
              
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Marks</span>
                <span className="font-medium">{s.totalMarks}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Attendance weight</span>
                <span className="font-medium">{s.attendanceWeight}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}