export type Activity = {
  id: string;
  periodId: string;
  name: string;
  weight: number;
  limitDate: string;
  createdAt?: string;
};

export type Period = {
  id: string;
  name: string;
  startDate: string;
  finishDate: string;
  activities: Activity[];
};

export type PeriodApiDto = {
  id?: string;
  classroomId?: string;
  label?: string;
  startDate?: string;
  finishDate?: string;
  createdAt?: string;
};

export type ActivityApiDto = {
  id?: string;
  classroomId?: string;
  periodId?: string;
  label?: string;
  weight?: number;
  limitDate?: string;
  createdAt?: string;
};

export type CreatePeriodPayload = {
  label: string;
  startDate: string;
  finishDate: string;
};

export type UpdatePeriodPayload = {
  label?: string;
  startDate?: string;
  finishDate?: string;
};

export type CreateActivityPayload = {
  periodId: string;
  label: string;
  weight: number;
  limitDate: string;
};

export type UpdateActivityPayload = {
  periodId?: string;
  label?: string;
  weight?: number;
  limitDate?: string;
};

export type CreatePeriodFormPayload = {
  name: string;
  startDate: string;
  finishDate: string;
};

export type CreateActivityFormPayload = {
  name: string;
  weightPercent: number;
  limitDate: string;
};
