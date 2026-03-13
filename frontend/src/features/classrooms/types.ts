export type ClassroomStatus = "active" | "archived";

export interface Classroom {
  id: string;
  name: string;
  room: string;
  status: ClassroomStatus;
  createdAt: string;
  updatedAt: string;
  studentsCount: number;
  periodsCount: number;
  activitiesCount: number;
}

export type ClassroomApiDto = {
  id?: string;
  name?: string;
  room?: string;
  status?: ClassroomStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateClassroomPayload = {
  name: string;
  room: string;
};

export type UpdateClassroomPayload = {
  name?: string;
  room?: string;
  status?: ClassroomStatus;
};

export type CreateClassroomFormPayload = {
  className: string;
  classroom: string;
};
