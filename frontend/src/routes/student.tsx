import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GraduationCap, LogOut, Calendar, BookOpen, FileText, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import api from "@/lib/api";
import { initSocket, disconnectSocket } from "@/lib/socket";

export const Route = createFileRoute("/student")({
  head: () => ({ meta: [{ title: "My dashboard — EduTrack" }] }),
  component: StudentDashboard,
});

function gradeFor(pct: number) {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  return "F";
}

function StudentDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState<any>(user);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [attendances, setAttendances] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    
    // Connect to websocket
    const socket = initSocket();
    if (socket) {
      socket.on("connect", () => console.log("Socket connected!"));
      socket.on("attendanceUpdated", (data) => {
        toast.success("Teacher updated attendance just now!");
        fetchData();
      });
      socket.on("newAssignment", (data) => {
        toast.info(`New Assignment: ${data.title}`);
        fetchData();
      });
      socket.on("marksUpdated", (data) => {
        toast.success("Your marks have been updated!");
        fetchData();
      });
    }

    return () => {
      if (socket) {
        socket.off("attendanceUpdated");
        socket.off("newAssignment");
        socket.off("marksUpdated");
        disconnectSocket();
      }
    };
  }, []);

  const fetchData = async () => {
    try {
      const [prof, att, asgmts, mrk] = await Promise.all([
        api.get('/student/my-profile'),
        api.get('/student/my-attendance'),
        api.get('/student/my-assignments'),
        api.get('/student/my-marks'),
      ]);
      setProfile(prof.data);
      setAttendances(att.data.data);
      setAssignments(asgmts.data.data);
      setMarks(mrk.data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load real-time data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    disconnectSocket();
    logout();
    toast.success("Signed out");
    router.navigate({ to: "/" });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Syncing your data in real-time...</div>;
  }

  const name = profile?.name ?? "Student";
  const initials = name.split(" ").map((s: string) => s[0]).join("").slice(0, 2).toUpperCase();

  const maxTotal = marks.reduce((a, s) => a + s.totalMarks, 0) || 100;
  const obtained = marks.reduce((a, s) => a + s.marksObtained, 0) || 0;
  const pct = Math.round((obtained / maxTotal) * 100);
  const grade = gradeFor(pct);
  
  const presentCount = attendances.filter(a => a.status === 'Present').length;
  const attendancePct = attendances.length ? Math.round((presentCount / attendances.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">EduTrack</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="mr-1 h-4 w-4" />Sign out</Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Profile */}
        <Card className="border-border/60 overflow-hidden">
          <div className="h-24" style={{ background: "var(--gradient-hero)" }} />
          <CardContent className="relative -mt-10 p-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              <Avatar className="h-20 w-20 border-4 border-background shadow-md">
                <AvatarFallback className="bg-primary text-xl font-bold text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
                <p className="text-sm text-muted-foreground">{profile?.email} · Class {profile?.class} · Roll {profile?.rollNumber}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">Grade {grade}</Badge>
                <Badge variant="default" className="text-sm">{pct}%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-border/60"><CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5" />Attendance</div>
            <div className="mt-2 text-2xl font-bold">{attendancePct}%</div>
            <Progress value={attendancePct} className="mt-3" />
          </CardContent></Card>
          <Card className="border-border/60"><CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Award className="h-3.5 w-3.5" />Overall Grade</div>
            <div className="mt-2 text-2xl font-bold">{grade}</div>
            <p className="mt-3 text-xs text-muted-foreground">{obtained}/{maxTotal} marks</p>
          </CardContent></Card>
          <Card className="border-border/60"><CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><FileText className="h-3.5 w-3.5" />Pending Assignments</div>
            <div className="mt-2 text-2xl font-bold">{assignments.length}</div>
            <p className="mt-3 text-xs text-muted-foreground">Due soon</p>
          </CardContent></Card>
        </div>

        {/* Marks Breakdown */}
        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Subjects & Marks</h3>
            </div>
            <div className="mt-4 space-y-4">
              {marks.length === 0 ? <p className="text-sm text-muted-foreground">No marks recorded yet.</p> : marks.map((m) => {
                const p = Math.round((m.marksObtained / m.totalMarks) * 100);
                return (
                  <div key={m._id}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{m.subject?.name || "Subject"} ({m.examType})</span>
                      <span className="text-muted-foreground">{m.marksObtained}/{m.totalMarks} · <span className="font-medium text-foreground">{gradeFor(p)}</span></span>
                    </div>
                    <Progress value={p} className="mt-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Assignments */}
        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Assignments</h3>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {assignments.length === 0 ? <p className="text-sm text-muted-foreground col-span-2">No pending assignments.</p> : assignments.map((a) => (
                <div key={a._id} className="rounded-lg border border-border/60 p-4 transition-all hover:border-primary/40 hover:shadow-sm">
                  <div className="text-xs font-medium uppercase tracking-wider text-primary">{a.subject?.name || "Subject"}</div>
                  <h4 className="mt-1 font-semibold">{a.title}</h4>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{a.description}</p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />Due {new Date(a.dueDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}