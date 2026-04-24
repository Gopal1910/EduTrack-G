import { useState, type ReactNode } from "react";
import { Link, useRouter, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, BookOpen, CalendarCheck, ClipboardList,
  FileText, BarChart3, GraduationCap, Menu, LogOut, Bell, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

interface NavItem { label: string; to: string; icon: React.ComponentType<{ className?: string }>; }

const teacherNav: NavItem[] = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "Students", to: "/dashboard/students", icon: Users },
  { label: "Subjects", to: "/dashboard/subjects", icon: BookOpen },
  { label: "Attendance", to: "/dashboard/attendance", icon: CalendarCheck },
  { label: "Marks", to: "/dashboard/marks", icon: ClipboardList },
  { label: "Assignments", to: "/dashboard/assignments", icon: FileText },
  { label: "Reports", to: "/dashboard/reports", icon: BarChart3 },
];

export function DashboardLayout({ children, title }: { children: ReactNode; title: string }) {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const router = useRouter();
  const { user, logout } = useAuth();
  const initials = (user?.name ?? "T").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    router.navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen flex-col border-r border-border/60 bg-background transition-all duration-300 md:flex",
          open ? "w-64" : "w-[72px]"
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-border/60 px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          {open && <span className="text-base font-bold tracking-tight">EduTrack</span>}
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {teacherNav.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {open && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border/60 p-3">
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setOpen((o) => !o)}>
            <Menu className="h-4 w-4" />
            {open && <span className="ml-2">Collapse</span>}
          </Button>
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-16 items-center gap-2 border-b border-border/60 px-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-base font-bold tracking-tight">EduTrack</span>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {teacherNav.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border/60 bg-background/90 px-4 backdrop-blur-lg sm:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." className="h-9 w-64 pl-9" />
            </div>
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex"><Bell className="h-4 w-4" /></Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full transition-opacity hover:opacity-80">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="font-medium">{user?.name ?? "Teacher"}</div>
                  <div className="text-xs font-normal text-muted-foreground">{user?.email ?? "teacher@school.edu"}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}