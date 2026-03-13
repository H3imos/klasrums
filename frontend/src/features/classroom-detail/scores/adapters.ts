import type {
  ActivityApiDto,
  PeriodApiDto,
  ScoreActivity,
  ScoreApiDto,
  ScorePeriod,
  ScoreRecord,
  ScoreStudent,
  StudentApiDto,
} from "./types";

const safeString = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const safeNumber = (value: unknown, fallback = 0): number => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const toPeriodModel = (payload: PeriodApiDto): ScorePeriod => ({
  id: safeString(payload.id),
  label: safeString(payload.label, "Periodo"),
  activities: [],
});

export const toActivityModel = (payload: ActivityApiDto): ScoreActivity => ({
  id: safeString(payload.id),
  periodId: safeString(payload.periodId),
  label: safeString(payload.label, "Actividad"),
  weight: safeNumber(payload.weight),
});

export const toStudentModel = (payload: StudentApiDto): ScoreStudent => ({
  id: safeString(payload.id),
  fullName: safeString(payload.fullName, "Estudiante"),
});

export const toScoreModel = (payload: ScoreApiDto): ScoreRecord => ({
  id: safeString(payload.id),
  classroomId: safeString(payload.classroomId),
  studentId: safeString(payload.studentId),
  activityId: safeString(payload.activityId),
  score: safeNumber(payload.score),
  createdAt: safeString(payload.createdAt),
  updatedAt: safeString(payload.updatedAt),
});
