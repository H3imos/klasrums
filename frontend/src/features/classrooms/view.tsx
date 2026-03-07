import * as Mantine from "@mantine/core";
import { Fragment } from "react/jsx-runtime";

export default function ClassroomsView() {
  const renderClassroom = () => {
    return (
      <Mantine.Paper shadow="sm" p="lg">
        <Mantine.Group justify="space-between" style={{ marginBottom: 5 }}>
          <Mantine.Text fw={600}>Clase de Matemáticas</Mantine.Text>
          <Mantine.Badge color="orange" variant="light">
            En curso
          </Mantine.Badge>
        </Mantine.Group>
        <Mantine.Text size="xs" c="dimmed">
          Esta clase se enfoca en álgebra y geometría para estudiantes de
          secundaria.
        </Mantine.Text>
        <Mantine.Table variant="vertical" fz="xs" mt="md">
          <Mantine.Table.Tbody>
            <Mantine.Table.Tr>
              <Mantine.Table.Th>Profesor</Mantine.Table.Th>
              <Mantine.Table.Td>Juan Pérez</Mantine.Table.Td>
            </Mantine.Table.Tr>
            <Mantine.Table.Tr>
              <Mantine.Table.Th>Estudiantes</Mantine.Table.Th>
              <Mantine.Table.Td>30</Mantine.Table.Td>
            </Mantine.Table.Tr>
            <Mantine.Table.Tr>
              <Mantine.Table.Th>Actividades</Mantine.Table.Th>
              <Mantine.Table.Td>10</Mantine.Table.Td>
            </Mantine.Table.Tr>
            <Mantine.Table.Tr>
              <Mantine.Table.Th>Fecha de inicio</Mantine.Table.Th>
              <Mantine.Table.Td>1 de septiembre de 2024</Mantine.Table.Td>
            </Mantine.Table.Tr>
          </Mantine.Table.Tbody>
        </Mantine.Table>
        <Mantine.Flex justify="flex-end" mt="md">
          <Mantine.Button color="dark.5" size="xs">
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
            <Mantine.Title order={3}>Listado de clases</Mantine.Title>
            <Mantine.Text size="xs" c="dimmed">
              Crea y administra tus clases de manera sencilla.
            </Mantine.Text>
          </Mantine.Box>
          <Mantine.Button>Crear clase</Mantine.Button>
        </Mantine.Group>

        <Mantine.SimpleGrid cols={2} mt="md">
          {renderClassroom()}
          {renderClassroom()}
          {renderClassroom()}
        </Mantine.SimpleGrid>
      </Fragment>
    );
  };

  return renderComponent();
}
