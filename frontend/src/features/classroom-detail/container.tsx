import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { modals } from "@mantine/modals";

import routes from "../../constants/routes";
import * as ClassroomsHooks from "../classrooms/hooks";
import ClassroomDetailView from "./view";

import type { CreateClassroomFormPayload } from "../classrooms/types";

export default function ClassroomDetailContainer() {
  const navigate = useNavigate();
  const { classroomId = "" } = useParams();

  const classroomsQuery = ClassroomsHooks.useClassrooms();
  const updateClassroomMutation = ClassroomsHooks.useUpdateClassroom();
  const deleteClassroomMutation = ClassroomsHooks.useDeleteClassroom();

  const [editModalOpened, setEditModalOpened] = useState(false);

  const classroom = (classroomsQuery.data ?? []).find(
    (item) => item.id === classroomId,
  );

  const handleEditClassroom = async (payload: CreateClassroomFormPayload) => {
    if (!classroomId) return;

    await updateClassroomMutation.mutateAsync({
      id: classroomId,
      payload: {
        name: payload.className,
        room: payload.classroom,
      },
    });

    setEditModalOpened(false);
  };

  const handleDeleteClassroom = () => {
    if (!classroomId || !classroom) return;

    modals.openConfirmModal({
      title: "Eliminar curso",
      children: `¿Estás seguro de eliminar el curso ${classroom.name}? Esta acción no se puede deshacer.`,
      labels: {
        confirm: "Eliminar",
        cancel: "Cancelar",
      },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        await deleteClassroomMutation.mutateAsync(classroomId);
        navigate(routes.CLASSROOMS);
      },
    });
  };

  return (
    <ClassroomDetailView
      classroomName={classroom?.name ?? "Clase"}
      classroomRoom={classroom?.room ?? ""}
      editModalOpened={editModalOpened}
      isEditing={updateClassroomMutation.isPending}
      isDeleting={deleteClassroomMutation.isPending}
      errorMessage={
        classroomsQuery.error?.message ??
        updateClassroomMutation.error?.message ??
        deleteClassroomMutation.error?.message
      }
      onOpenEditModal={() => setEditModalOpened(true)}
      onCloseEditModal={() => setEditModalOpened(false)}
      onEditClassroom={handleEditClassroom}
      onDeleteClassroom={handleDeleteClassroom}
    />
  );
}
