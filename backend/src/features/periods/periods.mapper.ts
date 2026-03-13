import type { PeriodResponseDto } from "./periods.dto";
import type { PeriodModel } from "./periods.model";

export const toPeriodDto = (model: PeriodModel): PeriodResponseDto => ({
  id: model.id,
  classroomId: model.classroomId,
  label: model.label,
  startDate: model.startDate,
  finishDate: model.finishDate,
  createdAt: model.createdAt,
});
