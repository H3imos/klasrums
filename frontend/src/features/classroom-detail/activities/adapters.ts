import type { Activity, ActivityApiDto, Period, PeriodApiDto } from "./types";

const safeString = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const safeNumber = (value: unknown, fallback = 0): number => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const toPeriodModel = (payload: PeriodApiDto): Period => {
  const createdAt = safeString(payload?.createdAt);

  return {
    id: safeString(payload?.id),
    name: safeString(payload?.label, "Periodo sin nombre"),
    dateStart: createdAt,
    dateEnd: createdAt,
    activities: [],
    position: payload?.position !== undefined ? safeNumber(payload.position) : undefined
  };
};

export const toActivityModel = (payload: ActivityApiDto): Activity => {
  const createdAt = safeString(payload?.createdAt);

  return {
    id: safeString(payload?.id),
    periodId: safeString(payload?.periodId),
    name: safeString(payload?.label, "Actividad sin nombre"),
    weight: safeNumber(payload?.weight),
    dueDate: createdAt,
    status: "Abierta",
    createdAt
  };
};
