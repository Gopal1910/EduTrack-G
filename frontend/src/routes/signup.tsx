import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, GraduationCap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuth, type Role } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — EduTrack" }] }),
  component: SignupPage,
});

function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = useState<Role>("teacher");
  const [form, setForm] = useState({ name: "", email: "", password: "", institute: "", class: "", rollNumber: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Enter your full name";
    if (!form.email.includes("@")) next.email = "Enter a valid email";
    if (form.password.length < 6) next.password = "At least 6 characters";
    if (role === "teacher" && !form.institute.trim()) next.institute = "Required";
    if (role === "student" && !form.class.trim()) next.class = "Required";
    if (role === "student" && !form.rollNumber.trim()) next.rollNumber = "Required";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      // 1. Create account on backend
      const api = (await import("@/lib/api")).default;
      await api.post('/auth/signup', {
        name: form.name, email: form.email, 
        password: form.password, 
        role: role === "teacher" ? "Teacher" : "Student",
        institute: role === "teacher" ? form.institute : undefined,
        class: role === "student" ? form.class : undefined,
        rollNumber: role === "student" ? form.rollNumber : undefined,
      });

      // 2. Automatically log them in to receive tokens
      const res = await api.post('/auth/login', { email: form.email, password: form.password });
      const { accessToken, refreshToken, name: userName, role: userRole } = res.data;
      
      localStorage.setItem("edutrack_token", accessToken);
      localStorage.setItem("edutrack_refresh", refreshToken);

      login({
        name: userName, email: form.email, role: userRole.toLowerCase() as Role,
        institute: form.institute, class: form.class, rollNumber: form.rollNumber
      });
      toast.success("Account created!");
      router.navigate({ to: userRole === "Teacher" ? "/dashboard" : "/student" });
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">EduTrack</span>
        </Link>
        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-1 text-sm text-muted-foreground">Start managing your classroom in minutes.</p>

            <div className="mt-6 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
              {(["teacher", "student"] as const).map((r) => (
                <button type="button" key={r} onClick={() => setRole(r)} className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-all",
                  role === r ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                )}>{r}</button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={form.name} onChange={set("name")} placeholder="Jane Doe" />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={set("email")} placeholder="you@school.edu" />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPw ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>

              {role === "teacher" ? (
                <div className="space-y-2">
                  <Label htmlFor="institute">Institute name</Label>
                  <Input id="institute" value={form.institute} onChange={set("institute")} placeholder="Greenwood High" />
                  {errors.institute && <p className="text-xs text-destructive">{errors.institute}</p>}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Input id="class" value={form.class} onChange={set("class")} placeholder="10-A" />
                    {errors.class && <p className="text-xs text-destructive">{errors.class}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll no.</Label>
                    <Input id="rollNumber" value={form.rollNumber} onChange={set("rollNumber")} placeholder="A04" />
                    {errors.rollNumber && <p className="text-xs text-destructive">{errors.rollNumber}</p>}
                  </div>
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : "Create account"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}