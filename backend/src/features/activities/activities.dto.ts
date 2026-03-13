export interface ActivityResponseDto {
  id: string;
  classroomId: string;
  periodId: string;
  label: string;
  weight: number;
  createdAt: string;
}

export interface CreateActivityRequestDto {
  periodId: string;
  label: string;
  weight: number;
}

export interface UpdateActivityRequestDto {
  periodId?: string;
  label?: string;
  weight?: number;
}
