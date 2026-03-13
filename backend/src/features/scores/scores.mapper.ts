import type { ScoreResponseDto } from "./scores.dto";
import type { ScoreModel } from "./scores.model";

export const toScoreDto = (model: ScoreModel): ScoreResponseDto => ({
  id: model.id,
  classroomId: model.classroomId,
  studentId: model.studentId,
  activityId: model.activityId,
  score: model.score,
  createdAt: model.createdAt,
  updatedAt: model.updatedAt,
});
