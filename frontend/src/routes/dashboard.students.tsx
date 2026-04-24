import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/app/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

export const Route = createFileRoute("/dashboard/students")({
  head: () => ({ meta: [{ title: "Students — EduTrack" }] }),
  component: StudentsPage,
});

function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ name: "", rollNumber: "", class: "", email: "", password: "password123" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/teacher/students?limit=100');
      setStudents(res.data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const classes = useMemo(() => Array.from(new Set(students.map((s) => s.class))), [students]);

  const filtered = students.filter((s) => {
    const q = query.toLowerCase();
    const matchQ = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || (s.rollNumber && s.rollNumber.toLowerCase().includes(q));
    const matchC = classFilter === "all" || s.class === classFilter;
    return matchQ && matchC;
  });

  const openAdd = () => {
    setDraft({ name: "", rollNumber: "", class: "", email: "", password: "password123" });
    setOpen(true);
  };

  const save = async () => {
    if (!draft.name || !draft.email) return toast.error("Name and email are required");
    try {
      // Re-using auth signup endpoint as generic user creator.
      await api.post('/auth/signup', { ...draft, role: "Student" });
      toast.success("Student added successfully");
      fetchStudents();
      setOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add student");
    }
  };

  return (
    <DashboardLayout title="Students">
      <Card className="border-border/60">
        <CardContent className="p-6">
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search by name, email or roll no." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
              </div>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All classes" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All classes</SelectItem>
                  {classes.map((c: any) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAdd}><Plus className="mr-1 h-4 w-4" />Add student</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add student</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-2">
                  <div className="space-y-2"><Label>Name</Label><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2"><Label>Roll No.</Label><Input value={draft.rollNumber} onChange={(e) => setDraft({ ...draft, rollNumber: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Class</Label><Input value={draft.class} onChange={(e) => setDraft({ ...draft, class: e.target.value })} /></div>
                  </div>
                  <div className="space-y-2"><Label>Email</Label><Input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></div>
                  <div className="space-y-2">
                    <Label>Assign Password</Label>
                    <Input type="text" value={draft.password} onChange={(e) => setDraft({ ...draft, password: e.target.value })} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={save}>Add</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-6 overflow-x-auto rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Roll No.</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">Loading...</TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">No students found</TableCell></TableRow>
                ) : (
                  filtered.map((s) => (
                    <TableRow key={s._id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.rollNumber}</TableCell>
                      <TableCell>{s.class}</TableCell>
                      <TableCell className="text-muted-foreground">{s.email}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" disabled><Pencil className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}