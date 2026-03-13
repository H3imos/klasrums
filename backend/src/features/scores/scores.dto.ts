export interface ScoreResponseDto {
  id: string;
  classroomId: string;
  studentId: string;
  activityId: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}

export interface SaveScoreRequestDto {
  studentId: string;
  activityId: string;
  score: number | null;
}
