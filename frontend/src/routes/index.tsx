import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/app/Navbar";
import { Footer } from "@/components/app/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarCheck, ClipboardList, BarChart3, Users, BookOpen, FileText,
  ArrowRight, Sparkles, CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EduTrack — Smart Attendance & Marks Management" },
      { name: "description", content: "The modern SaaS platform for schools and colleges to manage attendance, marks, assignments and performance reports." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: CalendarCheck, title: "Smart Attendance", desc: "One-tap attendance with instant summaries, trends and alerts for low attendance." },
  { icon: ClipboardList, title: "Marks Management", desc: "Subject-wise marks with automatic totals, percentages and grade calculation." },
  { icon: BarChart3, title: "Rich Reports", desc: "Interactive charts for performance, attendance distribution and progress over time." },
  { icon: Users, title: "Student Directory", desc: "Organize by class, search, filter and manage students in seconds." },
  { icon: BookOpen, title: "Subjects & Weights", desc: "Configure subjects, total marks and attendance weightage to match your curriculum." },
  { icon: FileText, title: "Assignments", desc: "Create assignments with due dates, track submissions and share with students." },
];

function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-60"
          style={{ background: "radial-gradient(1000px 500px at 50% -100px, oklch(0.96 0.04 263), transparent)" }}
        />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Built for modern classrooms
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Attendance & marks, <span className="text-primary">simplified.</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground sm:text-xl">
              EduTrack brings together attendance, grading, assignments and analytics in one calm, fast, beautifully designed workspace for teachers and students.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="h-12 px-6 text-base">
                <Link to="/signup">Get started<ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
                <Link to="/login">Sign in</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" />Free for educators</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" />GDPR-ready</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" />Works on any device</span>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="rounded-2xl border border-border/60 bg-background p-2 shadow-[var(--shadow-elevated)]">
              <div className="rounded-xl bg-muted/50 p-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { label: "Students", value: "248" },
                    { label: "Attendance", value: "92%" },
                    { label: "Avg. Marks", value: "78.4" },
                    { label: "Assignments", value: "14" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg bg-background p-4 shadow-sm">
                      <div className="text-xs font-medium text-muted-foreground">{s.label}</div>
                      <div className="mt-1 text-2xl font-bold">{s.value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 h-40 rounded-lg bg-background p-4 shadow-sm">
                  <div className="flex h-full items-end gap-2">
                    {[40, 65, 50, 80, 60, 90, 72, 85, 55, 95, 70, 88].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t bg-primary/80" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need, nothing you don't</h2>
            <p className="mt-3 text-muted-foreground">Purpose-built tools for educators, with a clean experience students actually enjoy.</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]">
                <CardContent className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role CTA */}
      <section id="how" className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="group relative overflow-hidden border-border/60 p-8 transition-all hover:shadow-[var(--shadow-elevated)]">
              <div className="text-sm font-semibold uppercase tracking-wider text-primary">For Teachers</div>
              <h3 className="mt-2 text-2xl font-bold">Run your class on autopilot</h3>
              <p className="mt-2 text-muted-foreground">Manage students, mark attendance, grade assessments and share reports — all in one place.</p>
              <Button asChild className="mt-6">
                <Link to="/login" search={{ role: "teacher" as const }}>Login as Teacher<ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </Card>
            <Card className="group relative overflow-hidden border-border/60 p-8 transition-all hover:shadow-[var(--shadow-elevated)]">
              <div className="text-sm font-semibold uppercase tracking-wider text-primary">For Students</div>
              <h3 className="mt-2 text-2xl font-bold">Stay on top of your progress</h3>
              <p className="mt-2 text-muted-foreground">See attendance, marks, grades and assignments — beautifully organized on any device.</p>
              <Button asChild variant="outline" className="mt-6">
                <Link to="/login" search={{ role: "student" as const }}>Login as Student<ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
