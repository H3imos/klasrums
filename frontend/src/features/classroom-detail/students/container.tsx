import { useState } from "react";
import { useParams } from "react-router";

import * as StudentsHooks from "./hooks";
import type { CreateStudentFormPayload } from "./types";
import StudentsView from "./view";

export default function StudentsContainer() {
  const { classroomId = "" } = useParams();
  const studentsQuery = StudentsHooks.useStudents(classroomId);
  const createStudentMutation = StudentsHooks.useCreateStudent(classroomId);
  const deleteStudentMutation = StudentsHooks.useDeleteStudent(classroomId);

  const [createStudentOpened, setCreateStudentOpened] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreateStudent = async (payload: CreateStudentFormPayload) => {
    if (!classroomId) return;

    await createStudentMutation.mutateAsync(payload);
    setCreateStudentOpened(false);
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!classroomId) return;
    setDeletingId(studentId);

    try {
      await deleteStudentMutation.mutateAsync(studentId);
    } finally {
      setDeletingId(null);
    }
  };

  const renderView = () => (
    <StudentsView
      students={studentsQuery.data ?? []}
      isLoading={studentsQuery.isLoading}
      errorMessage={
        studentsQuery.error?.message ?? deleteStudentMutation.error?.message
      }
      createErrorMessage={createStudentMutation.error?.message}
      isCreating={createStudentMutation.isPending}
      createModalOpened={createStudentOpened}
      deletingStudentId={deletingId}
      onOpenCreateModal={() => setCreateStudentOpened(true)}
      onCloseCreateModal={() => setCreateStudentOpened(false)}
      onCreateStudent={handleCreateStudent}
      onDeleteStudent={handleDeleteStudent}
    />
  );

  return renderView();
}
