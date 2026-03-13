export type ScorePeriod = {
  id: string;
  label: string;
  activities: ScoreActivity[];
};

export type ScoreActivity = {
  id: string;
  periodId: string;
  label: string;
  weight: number;
};

export type ScoreStudent = {
  id: string;
  fullName: string;
};

export type ScoreRecord = {
  id: string;
  classroomId: string;
  studentId: string;
  activityId: string;
  score: number;
  createdAt: string;
  updatedAt: string;
};

export type SaveScorePayload = {
  studentId: string;
  activityId: string;
  score: number | null;
};

export type PeriodApiDto = {
  id?: string;
  label?: string;
};

export type ActivityApiDto = {
  id?: string;
  periodId?: string;
  label?: string;
  weight?: number;
};

export type StudentApiDto = {
  id?: string;
  fullName?: string;
};

export type ScoreApiDto = {
  id?: string;
  classroomId?: string;
  studentId?: string;
  activityId?: string;
  score?: number;
  createdAt?: string;
  updatedAt?: string;
};
