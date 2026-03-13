export interface ClassroomResponseDto {
  id: string;
  name: string;
  room: string;
  status: "active" | "archived";
  studentsCount: number;
  periodsCount: number;
  activitiesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassroomRequestDto {
  name: string;
  room: string;
}

export interface UpdateClassroomRequestDto {
  name?: string;
  room?: string;
  status?: "active" | "archived";
}
