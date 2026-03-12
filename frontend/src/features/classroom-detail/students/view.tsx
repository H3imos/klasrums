import * as Mantine from "@mantine/core";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { studentsMock } from "./mock";

export default function StudentsView() {
  return (
    <Mantine.Stack>
      <Mantine.Group justify="space-between" align="end">
        <Mantine.Box>
          <Mantine.Title order={3}>Estudiantes</Mantine.Title>
          <Mantine.Text c="dimmed">
            Gestiona la informacion y acciones de cada estudiante.
          </Mantine.Text>
        </Mantine.Box>
        <Mantine.Button>Agregar estudiante</Mantine.Button>
      </Mantine.Group>

      <Mantine.SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {studentsMock.map((student) => (
          <Mantine.Paper key={student.id} withBorder p="md">
            <Mantine.Group
              justify="space-between"
              align="flex-start"
              wrap="nowrap"
            >
              <Mantine.Group wrap="nowrap" align="center">
                <Mantine.Avatar
                  name={student.fullName}
                  color="initials"
                />

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
                  >
                    <MoreVertical size={16} />
                  </Mantine.ActionIcon>
                </Mantine.Menu.Target>

                <Mantine.Menu.Dropdown>
                  <Mantine.Menu.Item leftSection={<Pencil size={14} />}>
                    Editar
                  </Mantine.Menu.Item>
                  <Mantine.Menu.Item
                    color="red"
                    leftSection={<Trash2 size={14} />}
                  >
                    Eliminar
                  </Mantine.Menu.Item>
                </Mantine.Menu.Dropdown>
              </Mantine.Menu>
            </Mantine.Group>
          </Mantine.Paper>
        ))}
      </Mantine.SimpleGrid>
    </Mantine.Stack>
  );
}
