export type Student = {
  id: string;
  classroomId: string;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type StudentApiDto = {
  id?: string;
  classroomId?: string;
  fullName?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateStudentPayload = {
  fullName: string;
  email: string;
};

export type CreateStudentFormPayload = {
  fullName: string;
  email: string;
};
