import type { StudentResponseDto } from "./students.dto";
import type { StudentModel } from "./students.model";

export const toStudentDto = (model: StudentModel): StudentResponseDto => ({
  id: model.id,
  classroomId: model.classroomId,
  fullName: model.fullName,
  email: model.email,
  createdAt: model.createdAt,
  updatedAt: model.updatedAt
});
