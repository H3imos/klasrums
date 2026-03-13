export type ActivityStatus = "Abierta" | "Cerrada";

export type Activity = {
  id: string;
  periodId: string;
  name: string;
  weight: number;
  dueDate: string;
  status: ActivityStatus;
  createdAt?: string;
};

export type Period = {
  id: string;
  name: string;
  dateStart: string;
  dateEnd: string;
  activities: Activity[];
  position?: number;
};

export type PeriodApiDto = {
  id?: string;
  classroomId?: string;
  label?: string;
  position?: number;
  createdAt?: string;
};

export type ActivityApiDto = {
  id?: string;
  classroomId?: string;
  periodId?: string;
  label?: string;
  weight?: number;
  createdAt?: string;
};

export type CreatePeriodPayload = {
  label: string;
  position: number;
};

export type CreateActivityPayload = {
  periodId: string;
  label: string;
  weight: number;
};

export type CreatePeriodFormPayload = {
  name: string;
  dateStart: string;
  dateEnd: string;
  position?: number;
};

export type CreateActivityFormPayload = {
  name: string;
  weightPercent: number;
};
