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

type LoginSearch = { role?: Role };

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): LoginSearch => {
    const role = s.role;
    return { role: role === "student" || role === "teacher" ? role : undefined };
  },
  head: () => ({ meta: [{ title: "Sign in — EduTrack" }] }),
  component: LoginPage,
});

function LoginPage() {
  const search = Route.useSearch();
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = useState<Role>(search.role ?? "teacher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!email.includes("@")) next.email = "Enter a valid email";
    if (password.length < 6) next.password = "Password must be at least 6 characters";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      const res = await import("@/lib/api").then(m => m.default.post('/auth/login', { email, password }));
      const { accessToken, refreshToken, name: userName, role: userRole, _id } = res.data;
      
      localStorage.setItem("edutrack_token", accessToken);
      localStorage.setItem("edutrack_refresh", refreshToken);
      
      login({ name: userName, email, role: userRole.toLowerCase() as Role });
      toast.success(`Welcome back, ${userName}!`);
      router.navigate({ to: userRole === "Teacher" ? "/dashboard" : "/student" });
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Invalid credentials");
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
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to continue to your dashboard.</p>

            <div className="mt-6 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
              {(["teacher", "student"] as const).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-all",
                    role === r ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" autoComplete="email" />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</> : "Sign in"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              New here?{" "}
              <Link to="/signup" className="font-medium text-primary hover:underline">Create an account</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}