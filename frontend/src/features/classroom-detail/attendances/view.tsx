import * as Mantine from "@mantine/core";

export default function AttendancesView() {
  return (
    <Mantine.Paper withBorder p="lg">
      <Mantine.Title order={4}>Asistencias</Mantine.Title>
      <Mantine.Text c="dimmed" mt="xs">
        Vista de ejemplo para gestionar asistencias del curso.
      </Mantine.Text>
    </Mantine.Paper>
  );
}
