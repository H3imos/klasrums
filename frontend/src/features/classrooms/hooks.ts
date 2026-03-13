import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as ClassroomsAdapters from "./adapters";
import * as ClassroomsServices from "./services";
import type {
  Classroom,
  CreateClassroomPayload,
  UpdateClassroomPayload,
} from "./types";

const classroomsQueryKey = ["classrooms"] as const;

export const useClassrooms = () =>
  useQuery<Classroom[], Error>({
    queryKey: classroomsQueryKey,
    queryFn: async () => {
      const data = await ClassroomsServices.listClassrooms();
      return data.map(ClassroomsAdapters.toClassroomModel);
    },
  });

export const useCreateClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation<Classroom, Error, CreateClassroomPayload>({
    mutationFn: async (payload) => {
      const created = await ClassroomsServices.createClassroom(payload);
      return ClassroomsAdapters.toClassroomModel(created);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: classroomsQueryKey }),
  });
};

export const useUpdateClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Classroom,
    Error,
    { id: string; payload: UpdateClassroomPayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const updated = await ClassroomsServices.updateClassroom(id, payload);
      return ClassroomsAdapters.toClassroomModel(updated);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: classroomsQueryKey }),
  });
};

export const useDeleteClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => ClassroomsServices.deleteClassroom(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: classroomsQueryKey }),
  });
};
