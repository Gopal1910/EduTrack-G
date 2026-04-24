import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/app/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";
import { mockStudents } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/reports")({
  head: () => ({ meta: [{ title: "Reports — EduTrack" }] }),
  component: ReportsPage,
});

const perf = mockStudents.map((s) => ({ name: s.name.split(" ")[0], score: Math.round(60 + Math.random() * 38) }));
const attendancePie = [
  { name: ">90%", value: 3, color: "var(--success)" },
  { name: "75-90%", value: 3, color: "var(--primary)" },
  { name: "<75%", value: 2, color: "var(--destructive)" },
];
const progress = [
  { month: "Jan", avg: 62 }, { month: "Feb", avg: 68 }, { month: "Mar", avg: 71 },
  { month: "Apr", avg: 74 }, { month: "May", avg: 78 }, { month: "Jun", avg: 82 },
];

function ReportsPage() {
  return (
    <DashboardLayout title="Reports">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardContent className="p-6">
            <h3 className="font-semibold">Student Performance</h3>
            <p className="text-xs text-muted-foreground">Average score by student</p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={perf}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", background: "var(--background)" }} />
                  <Bar dataKey="score" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6">
            <h3 className="font-semibold">Attendance Distribution</h3>
            <p className="text-xs text-muted-foreground">Students by attendance band</p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={attendancePie} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>
                    {attendancePie.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", background: "var(--background)" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="font-semibold">Class Progress</h3>
            <p className="text-xs text-muted-foreground">Average performance trend over time</p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", background: "var(--background)" }} />
                  <Line type="monotone" dataKey="avg" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}