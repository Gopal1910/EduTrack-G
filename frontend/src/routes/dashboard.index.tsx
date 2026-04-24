import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/app/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CalendarCheck, TrendingUp, ClipboardList, ArrowUpRight } from "lucide-react";
import api from "@/lib/api";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Dashboard — EduTrack" }] }),
  component: DashboardHome,
});

function DashboardHome() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.get('/reports/dashboard');
        setData(res.data);
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading || !data) {
    return (
      <DashboardLayout title="Overview">
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">Loading dashboard data...</div>
      </DashboardLayout>
    );
  }

  const stats = [
    { label: "Total Students", value: data.totalStudents, icon: Users, trend: "" },
    { label: "Avg. Attendance", value: data.avgAttendance, icon: CalendarCheck, trend: "" },
    { label: "Class Performance", value: data.classPerformance, icon: TrendingUp, trend: "" },
    { label: "Total Assignments", value: data.totalAssignments, icon: ClipboardList, trend: "" },
  ];

  return (
    <DashboardLayout title="Overview">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, trend }) => (
          <Card key={label} className="border-border/60">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                {trend ? (
                  <span className="inline-flex items-center gap-0.5 text-xs font-medium text-success">
                    <ArrowUpRight className="h-3 w-3" />{trend}
                  </span>
                ) : null}
              </div>
              <div className="mt-4 text-2xl font-bold">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="border-border/60 lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Weekly Attendance Overview</h3>
                <p className="text-xs text-muted-foreground">Students present per day</p>
              </div>
            </div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.weekly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", background: "var(--background)" }} />
                  <Bar dataKey="present" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6">
            <h3 className="font-semibold">Recent Activity</h3>
            <ul className="mt-4 space-y-4">
              {data.activity.map((a: any, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate"><span className="font-medium">{a.who}</span> <span className="text-muted-foreground">{a.what}</span></p>
                    <p className="text-xs text-muted-foreground">{a.when}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}