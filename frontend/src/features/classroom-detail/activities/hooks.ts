import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as ActivitiesAdapters from "./adapters";
import * as ActivitiesServices from "./services";
import type {
  Activity,
  CreateActivityPayload,
  CreatePeriodPayload,
  Period
} from "./types";

const periodsQueryKey = (classroomId: string) =>
  ["classroom-periods", classroomId] as const;

export const usePeriods = (classroomId: string) =>
  useQuery<Period[], Error>({
    queryKey: periodsQueryKey(classroomId),
    enabled: Boolean(classroomId),
    queryFn: async () => {
      const data = await ActivitiesServices.listPeriods(classroomId);
      return data.map(ActivitiesAdapters.toPeriodModel);
    },
  });

export const useCreatePeriod = (classroomId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Period, Error, CreatePeriodPayload>({
    mutationFn: async (payload) => {
      const created = await ActivitiesServices.createPeriod(
        classroomId,
        payload,
      );

      return ActivitiesAdapters.toPeriodModel(created);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: periodsQueryKey(classroomId) }),
  });
};

export const useDeletePeriod = (classroomId: string) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: (periodId) =>
      ActivitiesServices.deletePeriod(classroomId, periodId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: periodsQueryKey(classroomId) }),
  });
};

const activitiesQueryKey = (classroomId: string) =>
  ["classroom-activities", classroomId] as const;

export const useActivities = (classroomId: string) =>
  useQuery<Activity[], Error>({
    queryKey: activitiesQueryKey(classroomId),
    enabled: Boolean(classroomId),
    queryFn: async () => {
      const data = await ActivitiesServices.listActivities(classroomId);
      return data.map(ActivitiesAdapters.toActivityModel);
    }
  });

export const useCreateActivity = (classroomId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Activity, Error, CreateActivityPayload>({
    mutationFn: async (payload) => {
      const created = await ActivitiesServices.createActivity(
        classroomId,
        payload
      );

      return ActivitiesAdapters.toActivityModel(created);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: activitiesQueryKey(classroomId)
      })
  });
};
