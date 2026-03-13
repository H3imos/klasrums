export interface StudentResponseDto {
  id: string;
  classroomId: string;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentRequestDto {
  fullName: string;
  email: string;
}

export interface UpdateStudentRequestDto {
  fullName?: string;
  email?: string;
}
