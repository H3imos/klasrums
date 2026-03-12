export type AttendanceStudent = {
  id: string;
  fullName: string;
  email: string;
};

export type AttendanceStatus = "absent" | "present" | "late";

export const attendanceStudentsMock: AttendanceStudent[] = [
  {
    id: "st-1",
    fullName: "Ana Maria Gomez",
    email: "ana.gomez@colegio.edu.co",
  },
  {
    id: "st-2",
    fullName: "Carlos Andres Ruiz",
    email: "carlos.ruiz@colegio.edu.co",
  },
  {
    id: "st-3",
    fullName: "Diana Paola Lopez",
    email: "diana.lopez@colegio.edu.co",
  },
  {
    id: "st-4",
    fullName: "Mateo Perez",
    email: "mateo.perez@colegio.edu.co",
  },
  {
    id: "st-5",
    fullName: "Sara Valentina Torres",
    email: "sara.torres@colegio.edu.co",
  },
];
