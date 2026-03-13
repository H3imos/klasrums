import { useState } from "react";

import * as ClassroomsHooks from "./hooks";
import type { CreateClassroomFormPayload } from "./types";
import ClassroomsView from "./view";

export default function ClassroomsContainer() {
  const [createClassroomOpened, setCreateClassroomOpened] = useState(false);
  const classroomsQuery = ClassroomsHooks.useClassrooms();
  const createClassroomMutation = ClassroomsHooks.useCreateClassroom();

  const handleCreateClassroom = async (payload: CreateClassroomFormPayload) => {
    await createClassroomMutation.mutateAsync({
      name: payload.className,
      room: payload.classroom,
    });

    setCreateClassroomOpened(false);
  };

  const renderView = () => (
    <ClassroomsView
      classrooms={classroomsQuery.data ?? []}
      isLoading={classroomsQuery.isLoading}
      errorMessage={classroomsQuery.error?.message}
      createErrorMessage={createClassroomMutation.error?.message}
      createModalOpened={createClassroomOpened}
      isCreating={createClassroomMutation.isPending}
      onOpenCreateModal={() => setCreateClassroomOpened(true)}
      onCloseCreateModal={() => setCreateClassroomOpened(false)}
      onCreateClassroom={handleCreateClassroom}
    />
  );

  return renderView();
}
