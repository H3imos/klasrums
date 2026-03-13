import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

import * as StudentsAdapters from "./adapters";
import * as StudentsServices from "./services";
import type { CreateStudentPayload, Student } from "./types";

const studentsQueryKey = (classroomId: string) =>
  ["classroom-students", classroomId] as const;

export const useStudents = (classroomId: string) =>
  useQuery<Student[], Error>({
    queryKey: studentsQueryKey(classroomId),
    enabled: Boolean(classroomId),
    queryFn: async () => {
      const data = await StudentsServices.listStudents(classroomId);
      return data.map(StudentsAdapters.toStudentModel);
    },
  });

export const useCreateStudent = (classroomId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Student, Error, CreateStudentPayload>({
    mutationFn: async (payload) => {
      const created = await StudentsServices.createStudent(
        classroomId,
        payload,
      );
      return StudentsAdapters.toStudentModel(created);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentsQueryKey(classroomId),
      });
      notifications.show({
        title: "Estudiante creado",
        message: "El estudiante ha sido creado exitosamente",
        color: "green",
      });
    },
  });
};

export const useDeleteStudent = (classroomId: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (studentId) =>
      StudentsServices.deleteStudent(classroomId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentsQueryKey(classroomId),
      });
      notifications.show({
        title: "Estudiante eliminado",
        message: "El estudiante ha sido eliminado exitosamente",
        color: "green",
      });
    },
  });
};
