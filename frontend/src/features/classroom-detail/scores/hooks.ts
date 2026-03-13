import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as ScoresAdapters from "./adapters";
import * as ScoresServices from "./services";
import type {
  SaveScorePayload,
  ScoreActivity,
  ScorePeriod,
  ScoreRecord,
  ScoreStudent,
} from "./types";

const periodsQueryKey = (classroomId: string) =>
  ["classroom-periods", classroomId] as const;

const activitiesQueryKey = (classroomId: string) =>
  ["classroom-activities", classroomId] as const;

const studentsQueryKey = (classroomId: string) =>
  ["classroom-students", classroomId] as const;

const scoresQueryKey = (classroomId: string) =>
  ["classroom-scores", classroomId] as const;

export const usePeriods = (classroomId: string) =>
  useQuery<ScorePeriod[], Error>({
    queryKey: periodsQueryKey(classroomId),
    enabled: Boolean(classroomId),
    queryFn: async () => {
      const data = await ScoresServices.listPeriods(classroomId);
      return data.map(ScoresAdapters.toPeriodModel);
    },
  });

export const useActivities = (classroomId: string) =>
  useQuery<ScoreActivity[], Error>({
    queryKey: activitiesQueryKey(classroomId),
    enabled: Boolean(classroomId),
    queryFn: async () => {
      const data = await ScoresServices.listActivities(classroomId);
      return data.map(ScoresAdapters.toActivityModel);
    },
  });

export const useStudents = (classroomId: string) =>
  useQuery<ScoreStudent[], Error>({
    queryKey: studentsQueryKey(classroomId),
    enabled: Boolean(classroomId),
    queryFn: async () => {
      const data = await ScoresServices.listStudents(classroomId);
      return data.map(ScoresAdapters.toStudentModel);
    },
  });

export const useScores = (classroomId: string) =>
  useQuery<ScoreRecord[], Error>({
    queryKey: scoresQueryKey(classroomId),
    enabled: Boolean(classroomId),
    queryFn: async () => {
      const data = await ScoresServices.listScores(classroomId);
      return data.map(ScoresAdapters.toScoreModel);
    },
  });

export const useSaveScore = (classroomId: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, SaveScorePayload>({
    mutationFn: (payload) => ScoresServices.saveScore(classroomId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scoresQueryKey(classroomId) });
      notifications.show({
        title: "Calificacion guardada",
        message: "La celda fue actualizada correctamente",
        color: "green",
      });
    },
  });
};
