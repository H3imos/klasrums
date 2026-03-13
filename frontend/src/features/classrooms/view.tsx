import * as Mantine from "@mantine/core";
import { Fragment } from "react";
import { generatePath, Link } from "react-router";

import CreateClassroom from "./components/create-classroom";
import routes from "../../constants/routes";
import type { Classroom, CreateClassroomFormPayload } from "./types";

type ClassroomsViewProps = {
  classrooms: Classroom[];
  isLoading: boolean;
  isCreating: boolean;
  errorMessage?: string;
  createErrorMessage?: string;
  createModalOpened: boolean;
  onOpenCreateModal: () => void;
  onCloseCreateModal: () => void;
  onCreateClassroom: (payload: CreateClassroomFormPayload) => void;
};

export default function ClassroomsView({
  classrooms,
  isLoading,
  isCreating,
  errorMessage,
  createErrorMessage,
  createModalOpened,
  onOpenCreateModal,
  onCloseCreateModal,
  onCreateClassroom,
}: ClassroomsViewProps) {
  const renderClassroom = (classroom: Classroom, index: number) => (
    <Mantine.Paper key={classroom.id} shadow="sm" p="lg">
      <Mantine.Group justify="space-between" style={{ marginBottom: 5 }}>
        <Mantine.Text fz="lg" fw={600}>
          {classroom.name}
        </Mantine.Text>
        <Mantine.Badge
          color={classroom.status === "archived" ? "gray" : "orange"}
          variant="light"
        >
          {classroom.status === "archived" ? "Archivada" : "En curso"}
        </Mantine.Badge>
      </Mantine.Group>

      <Mantine.Table variant="vertical" mt="md">
        <Mantine.Table.Tbody>
          <Mantine.Table.Tr>
            <Mantine.Table.Td fw={600}>Estudiantes</Mantine.Table.Td>
            <Mantine.Table.Td>{classroom.studentsCount}</Mantine.Table.Td>
          </Mantine.Table.Tr>
          <Mantine.Table.Tr>
            <Mantine.Table.Td fw={600}>Periodos</Mantine.Table.Td>
            <Mantine.Table.Td>{classroom.periodsCount}</Mantine.Table.Td>
          </Mantine.Table.Tr>
          <Mantine.Table.Tr>
            <Mantine.Table.Td fw={600}>Actividades</Mantine.Table.Td>
            <Mantine.Table.Td>{classroom.activitiesCount}</Mantine.Table.Td>
          </Mantine.Table.Tr>
          <Mantine.Table.Tr>
            <Mantine.Table.Td fw={600}>Salón</Mantine.Table.Td>
            <Mantine.Table.Td>{classroom.room}</Mantine.Table.Td>
          </Mantine.Table.Tr>
        </Mantine.Table.Tbody>
      </Mantine.Table>
      <Mantine.Flex justify="flex-end" mt="md">
        <Mantine.Button
          color="dark.5"
          component={Link}
          to={generatePath(routes.CLASSROOM_DETAIL_ACTIVITIES, {
            classroomId: classroom.id,
          })}
          data-testid={`classrooms-detail-${index}-button`}
        >
          Ver detalles
        </Mantine.Button>
      </Mantine.Flex>
    </Mantine.Paper>
  );

  const renderComponent = () => {
    return (
      <Fragment>
        <Mantine.Group justify="space-between" align="flex-end">
          <Mantine.Box>
            <Mantine.Title order={2}>Listado de clases</Mantine.Title>
            <Mantine.Text c="dimmed">
              Crea y administra tus clases de manera sencilla.
            </Mantine.Text>
          </Mantine.Box>
          <Mantine.Button
            onClick={onOpenCreateModal}
            data-testid="classrooms-create-button"
          >
            Crear clase
          </Mantine.Button>
        </Mantine.Group>

        {errorMessage ? (
          <Mantine.Alert color="red" mt="md" variant="light">
            {errorMessage}
          </Mantine.Alert>
        ) : null}

        <CreateClassroom
          opened={createModalOpened}
          onClose={onCloseCreateModal}
          onSave={onCreateClassroom}
          isSaving={isCreating}
          errorMessage={createErrorMessage}
        />

        {isLoading ? (
          <Mantine.Center mt="md">
            <Mantine.Loader size="md" />
          </Mantine.Center>
        ) : (
          <Mantine.SimpleGrid cols={2} mt="md">
            {classrooms.map((classroom, index) =>
              renderClassroom(classroom, index),
            )}
          </Mantine.SimpleGrid>
        )}

        {!isLoading && classrooms.length === 0 ? (
          <Mantine.Text c="dimmed" mt="md">
            Aun no hay clases creadas.
          </Mantine.Text>
        ) : null}
      </Fragment>
    );
  };

  return renderComponent();
}
