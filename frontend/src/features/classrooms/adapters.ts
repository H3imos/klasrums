import type { Classroom, ClassroomApiDto, ClassroomStatus } from "./types";

const safeString = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const safeStatus = (value: unknown): ClassroomStatus =>
  value === "archived" ? "archived" : "active";

export const toClassroomModel = (payload: ClassroomApiDto): Classroom => ({
  id: safeString(payload?.id),
  name: safeString(payload?.name, "Clase sin nombre"),
  room: safeString(payload?.room),
  status: safeStatus(payload?.status),
  createdAt: safeString(payload?.createdAt),
  updatedAt: safeString(payload?.updatedAt),
  studentsCount: 0,
  periodsCount: 0,
  activitiesCount: 0
});
