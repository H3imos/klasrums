export interface PeriodResponseDto {
  id: string;
  classroomId: string;
  label: string;
  position: number;
  createdAt: string;
}

export interface CreatePeriodRequestDto {
  label: string;
  position: number;
}

export interface UpdatePeriodRequestDto {
  label?: string;
  position?: number;
}
