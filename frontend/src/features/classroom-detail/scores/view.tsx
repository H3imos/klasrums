import * as Mantine from "@mantine/core";

export default function ScoresView() {
  return (
    <Mantine.Paper withBorder p="lg">
      <Mantine.Title order={4}>Calificaciones</Mantine.Title>
      <Mantine.Text c="dimmed" mt="xs">
        Vista de ejemplo para gestionar calificaciones de la clase.
      </Mantine.Text>
    </Mantine.Paper>
  );
}
