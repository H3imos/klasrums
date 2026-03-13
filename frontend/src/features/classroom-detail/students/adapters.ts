import type { Student, StudentApiDto } from "./types";

const safeString = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

export const toStudentModel = (payload: StudentApiDto): Student => ({
  id: safeString(payload?.id),
  classroomId: safeString(payload?.classroomId),
  fullName: safeString(payload?.fullName, "Estudiante sin nombre"),
  email: safeString(payload?.email),
  createdAt: safeString(payload?.createdAt),
  updatedAt: safeString(payload?.updatedAt)
});
