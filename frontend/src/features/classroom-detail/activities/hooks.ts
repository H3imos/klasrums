import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as ActivitiesAdapters from "./adapters";
import * as ActivitiesServices from "./services";
import type {
  Activity,
  CreateActivityPayload,
  CreatePeriodPayload,
  Period,
  UpdatePeriodPayload,
  UpdateActivityPayload,
} from "./types";
import { notifications } from "@mantine/notifications";

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: periodsQueryKey(classroomId) });
      notifications.show({
        title: "Periodo creado",
        message: "El periodo ha sido creado exitosamente",
        color: "green",
      });
    },
  });
};

export const useDeletePeriod = (classroomId: string) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: (periodId) =>
      ActivitiesServices.deletePeriod(classroomId, periodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: periodsQueryKey(classroomId) });
      notifications.show({
        title: "Periodo eliminado",
        message: "El periodo ha sido eliminado exitosamente",
        color: "green",
      });
    },
  });
};

export const useUpdatePeriod = (classroomId: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    Period,
    Error,
    { id: string; payload: UpdatePeriodPayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const updated = await ActivitiesServices.updatePeriod(
        classroomId,
        id,
        payload,
      );
      return ActivitiesAdapters.toPeriodModel(updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: periodsQueryKey(classroomId) });
      notifications.show({
        title: "Periodo actualizado",
        message: "El periodo ha sido actualizado exitosamente",
        color: "green",
      });
    },
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
    },
  });

export const useCreateActivity = (classroomId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Activity, Error, CreateActivityPayload>({
    mutationFn: async (payload) => {
      const created = await ActivitiesServices.createActivity(
        classroomId,
        payload,
      );

      return ActivitiesAdapters.toActivityModel(created);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: activitiesQueryKey(classroomId),
      });
      notifications.show({
        title: "Actividad creada",
        message: "La actividad ha sido creada exitosamente",
        color: "green",
      });
    },
  });
};

export const useDeleteActivity = (classroomId: string) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: (activityId) =>
      ActivitiesServices.deleteActivity(classroomId, activityId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: activitiesQueryKey(classroomId),
      });
      notifications.show({
        title: "Actividad eliminada",
        message: "La actividad ha sido eliminada exitosamente",
        color: "green",
      });
    },
  });
};

export const useUpdateActivity = (classroomId: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    Activity,
    Error,
    { id: string; payload: UpdateActivityPayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const updated = await ActivitiesServices.updateActivity(
        classroomId,
        id,
        payload,
      );
      return ActivitiesAdapters.toActivityModel(updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: activitiesQueryKey(classroomId),
      });
      notifications.show({
        title: "Actividad actualizada",
        message: "La actividad ha sido actualizada exitosamente",
        color: "green",
      });
    },
  });
};
