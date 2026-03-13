import type { ActivityResponseDto } from "./activities.dto";
import type { ActivityModel } from "./activities.model";

export const toActivityDto = (model: ActivityModel): ActivityResponseDto => ({
  id: model.id,
  classroomId: model.classroomId,
  periodId: model.periodId,
  label: model.label,
  weight: model.weight,
  limitDate: model.limitDate,
  createdAt: model.createdAt
});
