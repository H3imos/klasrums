export interface PeriodResponseDto {
  id: string;
  classroomId: string;
  label: string;
  startDate: string;
  finishDate: string;
  createdAt: string;
}

export interface CreatePeriodRequestDto {
  label: string;
  startDate: string;
  finishDate: string;
}

export interface UpdatePeriodRequestDto {
  label?: string;
  startDate?: string;
  finishDate?: string;
}
