import type { ClassroomResponseDto } from "./classrooms.dto";
import type { ClassroomModel } from "./classrooms.model";

export const toClassroomDto = (
  model: ClassroomModel,
): ClassroomResponseDto => ({
  id: model.id,
  name: model.name,
  room: model.room,
  status: model.status,
  createdAt: model.createdAt,
  updatedAt: model.updatedAt,
});
