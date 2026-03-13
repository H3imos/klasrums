export interface ActivityResponseDto {
  id: string;
  classroomId: string;
  periodId: string;
  label: string;
  weight: number;
  limitDate: string;
  createdAt: string;
}

export interface CreateActivityRequestDto {
  periodId: string;
  label: string;
  weight: number;
  limitDate: string;
}

export interface UpdateActivityRequestDto {
  periodId?: string;
  label?: string;
  weight?: number;
  limitDate?: string;
}
