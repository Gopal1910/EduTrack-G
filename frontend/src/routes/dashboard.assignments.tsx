import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/app/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Plus, Calendar, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

export const Route = createFileRoute("/dashboard/assignments")({
  head: () => ({ meta: [{ title: "Assignments — EduTrack" }] }),
  component: AssignmentsPage,
});

function AssignmentsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ title: "", description: "", dueDate: "", subjectId: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [asgRes, subRes] = await Promise.all([
        api.get('/teacher/assignments'),
        api.get('/teacher/subjects')
      ]);
      setItems(asgRes.data.data);
      setSubjects(subRes.data.data);
    } catch (e) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const add = async () => {
    if (!draft.title || !draft.dueDate || !draft.subjectId) return toast.error("Title, Subject, and due date required");
    
    // Find the subject class
    const sub = subjects.find(s => s._id === draft.subjectId);
    if (!sub) return toast.error("Invalid subject");

    try {
      const res = await api.post('/teacher/assignments', {
        ...draft, class: sub.class,
      });
      setItems((l) => [res.data, ...l]);
      setDraft({ title: "", description: "", dueDate: "", subjectId: "" });
      setOpen(false);
      toast.success("Assignment created & broadcasted");
    } catch (e) {
      toast.error("Failed to create assignment");
    }
  };

  return (
    <DashboardLayout title="Assignments">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Create and share assignments with your class.</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" />New assignment</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New assignment</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="space-y-2"><Label>Title</Label><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select value={draft.subjectId} onValueChange={(v) => setDraft({ ...draft, subjectId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {subjects.map(sub => (
                        <SelectItem key={sub._id} value={sub._id}>{sub.name} ({sub.class})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Due date</Label><Input type="date" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} /></div>
              </div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={add}>Create</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? <p className="text-muted-foreground text-sm py-8 col-span-3 text-center">Loading assignments...</p> : items.length === 0 ? <p className="text-muted-foreground text-sm py-8 col-span-3 text-center">No assignments configured.</p> : null}
        {items.map((a) => (
          <Card key={a._id} className="border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <Button variant="ghost" size="icon" disabled>
                  <Trash2 className="h-4 w-4 text-muted-foreground/30" />
                </Button>
              </div>
              <div className="mt-4">
                <div className="text-xs font-medium uppercase tracking-wider text-primary">{a.subject?.name || "Subject"} ({a.class})</div>
                <h3 className="mt-1 font-semibold">{a.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{a.description}</p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />Due {new Date(a.dueDate).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}