import * as Mantine from "@mantine/core";
import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { Fragment } from "react/jsx-runtime";

import CreateStudent from "./components/create-student";
import type { CreateStudentFormPayload, Student } from "./types";

type StudentsViewProps = {
  students: Student[];
  isLoading: boolean;
  search: string;
  isCreating: boolean;
  createModalOpened: boolean;
  deletingStudentId?: string | null;
  errorMessage?: string;
  createErrorMessage?: string;
  onOpenCreateModal: () => void;
  onCloseCreateModal: () => void;
  onSearchChange: (value: string) => void;
  onCreateStudent: (payload: CreateStudentFormPayload) => void;
  onDeleteStudent: (studentId: string) => void;
};

export default function StudentsView({
  students,
  isLoading,
  search,
  isCreating,
  createModalOpened,
  deletingStudentId,
  errorMessage,
  createErrorMessage,
  onOpenCreateModal,
  onCloseCreateModal,
  onSearchChange,
  onCreateStudent,
  onDeleteStudent,
}: StudentsViewProps) {
  return (
    <Fragment>
      <Mantine.Box mb="sm">
        <Mantine.Title order={3}>Estudiantes</Mantine.Title>
        <Mantine.Text c="dimmed">
          Gestiona la información y acciones de cada estudiante.
        </Mantine.Text>
      </Mantine.Box>

      <Mantine.Stack>
        {" "}
        <Mantine.Group align="center">
          <Mantine.TextInput
            value={search}
            onChange={(event) => onSearchChange(event.currentTarget.value)}
            placeholder="Buscar por nombre o correo"
            variant="filled"
            flex={1}
            data-testid="students-search-input"
          />
          <Mantine.Button
            onClick={onOpenCreateModal}
            data-testid="students-create-button"
            leftSection={<Plus size={16} />}
          >
            Agregar estudiante
          </Mantine.Button>
        </Mantine.Group>
        {errorMessage ? (
          <Mantine.Alert color="red" variant="light">
            {errorMessage}
          </Mantine.Alert>
        ) : null}
        {isLoading ? (
          <Mantine.Center>
            <Mantine.Loader size="md" />
          </Mantine.Center>
        ) : students.length === 0 ? (
          <Mantine.Box ta="center" mt="xl">
            <Mantine.Title order={3}>Sin resultados</Mantine.Title>
            <Mantine.Text c="dimmed">
              No hay estudiantes en esta clase
            </Mantine.Text>
          </Mantine.Box>
        ) : (
          <Mantine.SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            {students.map((student, index) => (
              <Mantine.Paper key={student.id} withBorder p="md">
                <Mantine.Group
                  justify="space-between"
                  align="flex-start"
                  wrap="nowrap"
                >
                  <Mantine.Group wrap="nowrap" align="center">
                    <Mantine.Avatar name={student.fullName} color="initials" />

                    <Mantine.Box>
                      <Mantine.Text fw={600}>{student.fullName}</Mantine.Text>
                      <Mantine.Text size="sm" c="dimmed">
                        {student.email}
                      </Mantine.Text>
                    </Mantine.Box>
                  </Mantine.Group>

                  <Mantine.Menu
                    shadow="md"
                    width={160}
                    position="bottom-end"
                    withinPortal
                  >
                    <Mantine.Menu.Target>
                      <Mantine.ActionIcon
                        variant="subtle"
                        color="gray"
                        aria-label="Acciones"
                        data-testid={`students-actions-${index}-button`}
                      >
                        <MoreVertical size={16} />
                      </Mantine.ActionIcon>
                    </Mantine.Menu.Target>

                    <Mantine.Menu.Dropdown>
                      <Mantine.Menu.Item
                        leftSection={<Pencil size={14} />}
                        disabled
                        data-testid={`students-edit-${index}-button`}
                      >
                        Editar
                      </Mantine.Menu.Item>
                      <Mantine.Menu.Item
                        color="red"
                        leftSection={<Trash2 size={14} />}
                        onClick={() => onDeleteStudent(student.id)}
                        disabled={deletingStudentId === student.id}
                        data-testid={`students-delete-${index}-button`}
                      >
                        Eliminar
                      </Mantine.Menu.Item>
                    </Mantine.Menu.Dropdown>
                  </Mantine.Menu>
                </Mantine.Group>
              </Mantine.Paper>
            ))}
          </Mantine.SimpleGrid>
        )}
      </Mantine.Stack>

      <CreateStudent
        opened={createModalOpened}
        onClose={onCloseCreateModal}
        onSave={onCreateStudent}
        isSaving={isCreating}
        errorMessage={createErrorMessage}
      />
    </Fragment>
  );
}
