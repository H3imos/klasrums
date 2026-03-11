import * as Mantine from "@mantine/core";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { generatePath, Link } from "react-router";

import CreateClassroom from "./components/create-classroom";
import routes from "../../constants/routes";

export default function ClassroomsView() {
  const [createClassroomOpened, setCreateClassroomOpened] = useState(false);

  const handleCreateClassroom = (payload: {
    className: string;
    classroom: string;
  }) => {
    console.log("Nueva clase", payload);
  };

  const renderClassroom = (id: string) => {
    return (
      <Mantine.Paper shadow="sm" p="lg">
        <Mantine.Group justify="space-between" style={{ marginBottom: 5 }}>
          <Mantine.Text fz="lg" fw={600}>
            Clase de Matemáticas
          </Mantine.Text>
          <Mantine.Badge color="orange" variant="light">
            En curso
          </Mantine.Badge>
        </Mantine.Group>

        <Mantine.Table variant="vertical" mt="md">
          <Mantine.Table.Tbody>
            <Mantine.Table.Tr>
              <Mantine.Table.Td fw={600}>Estudiantes</Mantine.Table.Td>
              <Mantine.Table.Td>30</Mantine.Table.Td>
            </Mantine.Table.Tr>
            <Mantine.Table.Tr>
              <Mantine.Table.Td fw={600}>Periodos</Mantine.Table.Td>
              <Mantine.Table.Td>4</Mantine.Table.Td>
            </Mantine.Table.Tr>
            <Mantine.Table.Tr>
              <Mantine.Table.Td fw={600}>Actividades</Mantine.Table.Td>
              <Mantine.Table.Td>10</Mantine.Table.Td>
            </Mantine.Table.Tr>
            <Mantine.Table.Tr>
              <Mantine.Table.Td fw={600}>Salón</Mantine.Table.Td>
              <Mantine.Table.Td>101</Mantine.Table.Td>
            </Mantine.Table.Tr>
          </Mantine.Table.Tbody>
        </Mantine.Table>
        <Mantine.Flex justify="flex-end" mt="md">
          <Mantine.Button
            color="dark.5"
            component={Link}
              to={generatePath(routes.CLASSROOM_DETAIL_ACTIVITIES, {
              classroomId: id,
            })}
          >
            Ver detalles
          </Mantine.Button>
        </Mantine.Flex>
      </Mantine.Paper>
    );
  };

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
          <Mantine.Button onClick={() => setCreateClassroomOpened(true)}>
            Crear clase
          </Mantine.Button>
        </Mantine.Group>

        <CreateClassroom
          opened={createClassroomOpened}
          onClose={() => setCreateClassroomOpened(false)}
          onSave={handleCreateClassroom}
        />

        <Mantine.SimpleGrid cols={2} mt="md">
          {renderClassroom("abc123")}
          {renderClassroom("def456")}
          {renderClassroom("ghi789")}
        </Mantine.SimpleGrid>
      </Fragment>
    );
  };

  return renderComponent();
}
