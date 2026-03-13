import type { Activity, ActivityApiDto, Period, PeriodApiDto } from "./types";

const safeString = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const safeNumber = (value: unknown, fallback = 0): number => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const toPeriodModel = (payload: PeriodApiDto): Period => {
  return {
    id: safeString(payload?.id),
    name: safeString(payload?.label, "Periodo sin nombre"),
    startDate: safeString(payload?.startDate),
    finishDate: safeString(payload?.finishDate),
    activities: [],
  };
};

export const toActivityModel = (payload: ActivityApiDto): Activity => {
  return {
    id: safeString(payload?.id),
    periodId: safeString(payload?.periodId),
    name: safeString(payload?.label, "Actividad sin nombre"),
    weight: safeNumber(payload?.weight),
    limitDate: safeString(payload?.limitDate),
    createdAt: safeString(payload?.createdAt),
  };
};
