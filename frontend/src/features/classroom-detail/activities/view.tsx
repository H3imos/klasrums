import * as Mantine from "@mantine/core";
import { useState } from "react";

type Activity = {
  id: string;
  name: string;
  dueDate: string;
  status: "Abierta" | "Cerrada";
};

type Period = {
  id: string;
  name: string;
  activities: Activity[];
};

const periodsMock: Period[] = [
  {
    id: "p1",
    name: "Periodo 1",
    activities: [
      {
        id: "a1",
        name: "Quiz de fracciones",
        dueDate: "2026-03-20",
        status: "Abierta",
      },
      {
        id: "a2",
        name: "Taller de algebra",
        dueDate: "2026-03-25",
        status: "Cerrada",
      },
    ],
  },
  {
    id: "p2",
    name: "Periodo 2",
    activities: [
      {
        id: "a3",
        name: "Exposicion de geometria",
        dueDate: "2026-04-05",
        status: "Abierta",
      },
      {
        id: "a4",
        name: "Evaluacion de estadistica",
        dueDate: "2026-04-10",
        status: "Abierta",
      },
    ],
  },
];

export default function ActivitiesView() {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredPeriods = !normalizedQuery
    ? periodsMock
    : periodsMock
        .map((period) => ({
          ...period,
          activities: period.activities.filter((activity) =>
            activity.name.toLowerCase().includes(normalizedQuery),
          ),
        }))
        .filter((period) => period.activities.length > 0);

  const renderActivitiesTable = (activities: Activity[]) => {
    return (
      <Mantine.Table striped highlightOnHover>
        <Mantine.Table.Thead>
          <Mantine.Table.Tr>
            <Mantine.Table.Th>Actividad</Mantine.Table.Th>
            <Mantine.Table.Th>Fecha limite</Mantine.Table.Th>
            <Mantine.Table.Th>Estado</Mantine.Table.Th>
          </Mantine.Table.Tr>
        </Mantine.Table.Thead>
        <Mantine.Table.Tbody>
          {activities.map((activity) => (
            <Mantine.Table.Tr key={activity.id}>
              <Mantine.Table.Td>{activity.name}</Mantine.Table.Td>
              <Mantine.Table.Td>{activity.dueDate}</Mantine.Table.Td>
              <Mantine.Table.Td>
                <Mantine.Badge
                  variant="dot"
                  color={activity.status === "Abierta" ? "green" : "gray"}
                >
                  {activity.status}
                </Mantine.Badge>
              </Mantine.Table.Td>
            </Mantine.Table.Tr>
          ))}
        </Mantine.Table.Tbody>
      </Mantine.Table>
    );
  };

  return (
    <Mantine.Stack>
      <Mantine.Group justify="space-between" align="flex-end">
        <Mantine.TextInput
          variant="filled"
          placeholder="Buscar actividad..."
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          flex={1}
        />
        <Mantine.Select placeholder="Seleccionar estado" />
        <Mantine.Button>Crear periodo</Mantine.Button>
      </Mantine.Group>

      {filteredPeriods.length === 0 ? (
        <Mantine.Alert color="gray" title="Sin resultados">
          No se encontraron actividades para la busqueda actual.
        </Mantine.Alert>
      ) : (
        filteredPeriods.map((period) => (
          <Mantine.Paper key={period.id} withBorder p="md">
            <Mantine.Group align="center" mb="sm">
              <Mantine.Title order={4}>{period.name}</Mantine.Title>
              <Mantine.Text c="dimmed">
                {period.activities.length} actividades
              </Mantine.Text>
            </Mantine.Group>
            {renderActivitiesTable(period.activities)}
          </Mantine.Paper>
        ))
      )}
    </Mantine.Stack>
  );
}
