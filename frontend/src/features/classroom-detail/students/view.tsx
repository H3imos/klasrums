import * as Mantine from "@mantine/core";

export default function StudentsView() {
  return (
    <Mantine.Paper withBorder p="lg">
      <Mantine.Title order={4}>Estudiantes</Mantine.Title>
      <Mantine.Text c="dimmed" mt="xs">
        Vista de ejemplo para gestionar estudiantes del curso.
      </Mantine.Text>
    </Mantine.Paper>
  );
}
