import type { Classroom, ClassroomApiDto, ClassroomStatus } from "./types";

const safeString = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const safeNumber = (value: unknown, fallback = 0): number => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const safeStatus = (value: unknown): ClassroomStatus =>
  value === "archived" ? "archived" : "active";

export const toClassroomModel = (payload: ClassroomApiDto): Classroom => ({
  id: safeString(payload?.id),
  name: safeString(payload?.name, "Clase sin nombre"),
  room: safeString(payload?.room),
  status: safeStatus(payload?.status),
  createdAt: safeString(payload?.createdAt),
  updatedAt: safeString(payload?.updatedAt),
  studentsCount: safeNumber(payload?.studentsCount),
  periodsCount: safeNumber(payload?.periodsCount),
  activitiesCount: safeNumber(payload?.activitiesCount),
});
