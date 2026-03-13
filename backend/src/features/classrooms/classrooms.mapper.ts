import type { ClassroomResponseDto } from "./classrooms.dto";
import type { ClassroomModel } from "./classrooms.model";

export const toClassroomDto = (
  model: ClassroomModel,
): ClassroomResponseDto => ({
  id: model.id,
  name: model.name,
  room: model.room,
  status: model.status,
  studentsCount: model.studentsCount,
  periodsCount: model.periodsCount,
  activitiesCount: model.activitiesCount,
  createdAt: model.createdAt,
  updatedAt: model.updatedAt,
});
