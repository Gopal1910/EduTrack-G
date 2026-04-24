export interface Student {
  id: string;
  name: string;
  rollNo: string;
  class: string;
  email: string;
  attendance: number;
}

export interface Subject {
  id: string;
  name: string;
  totalMarks: number;
  attendanceWeight: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  subject: string;
}

export interface MarkEntry {
  studentId: string;
  subjectId: string;
  marks: number;
}

export const mockStudents: Student[] = [
  { id: "1", name: "Aarav Sharma", rollNo: "A01", class: "10-A", email: "aarav@school.edu", attendance: 94 },
  { id: "2", name: "Priya Patel", rollNo: "A02", class: "10-A", email: "priya@school.edu", attendance: 88 },
  { id: "3", name: "Rohan Mehta", rollNo: "A03", class: "10-A", email: "rohan@school.edu", attendance: 76 },
  { id: "4", name: "Ishita Rao", rollNo: "B01", class: "10-B", email: "ishita@school.edu", attendance: 91 },
  { id: "5", name: "Kabir Singh", rollNo: "B02", class: "10-B", email: "kabir@school.edu", attendance: 82 },
  { id: "6", name: "Ananya Iyer", rollNo: "B03", class: "10-B", email: "ananya@school.edu", attendance: 97 },
  { id: "7", name: "Dev Kapoor", rollNo: "C01", class: "9-A", email: "dev@school.edu", attendance: 70 },
  { id: "8", name: "Meera Nair", rollNo: "C02", class: "9-A", email: "meera@school.edu", attendance: 85 },
];

export const mockSubjects: Subject[] = [
  { id: "s1", name: "Mathematics", totalMarks: 100, attendanceWeight: 10 },
  { id: "s2", name: "Physics", totalMarks: 100, attendanceWeight: 15 },
  { id: "s3", name: "Chemistry", totalMarks: 100, attendanceWeight: 10 },
  { id: "s4", name: "English", totalMarks: 100, attendanceWeight: 5 },
  { id: "s5", name: "Computer Science", totalMarks: 100, attendanceWeight: 20 },
];

export const mockAssignments: Assignment[] = [
  { id: "a1", title: "Algebra Worksheet", description: "Complete exercises 4.1 to 4.5 from the textbook.", dueDate: "2025-05-02", subject: "Mathematics" },
  { id: "a2", title: "Physics Lab Report", description: "Write report on pendulum experiment conducted in class.", dueDate: "2025-05-08", subject: "Physics" },
  { id: "a3", title: "Essay: Climate Change", description: "600-word essay with references and conclusion.", dueDate: "2025-05-12", subject: "English" },
  { id: "a4", title: "Build a To-Do App", description: "Use React and Tailwind. Submit GitHub repo link.", dueDate: "2025-05-20", subject: "Computer Science" },
];

export function gradeFor(percent: number): string {
  if (percent >= 90) return "A";
  if (percent >= 75) return "B";
  if (percent >= 60) return "C";
  if (percent >= 40) return "D";
  return "F";
}

export function generateMarks(): Record<string, number> {
  const out: Record<string, number> = {};
  mockSubjects.forEach((s) => {
    out[s.id] = Math.floor(55 + Math.random() * 42);
  });
  return out;
}