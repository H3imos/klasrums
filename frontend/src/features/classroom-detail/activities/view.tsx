import * as Mantine from "@mantine/core";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import es from "dayjs/locale/es";

import { Fragment, useState } from "react";

import { periodsMock, type Activity } from "./mock";

dayjs.extend(localizedFormat);
dayjs.locale(es);

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
            <Mantine.Table.Th>Ponderación</Mantine.Table.Th>
            <Mantine.Table.Th>Fecha limite</Mantine.Table.Th>
            <Mantine.Table.Th>Estado</Mantine.Table.Th>
          </Mantine.Table.Tr>
        </Mantine.Table.Thead>
        <Mantine.Table.Tbody>
          {activities.map((activity) => (
            <Mantine.Table.Tr key={activity.id}>
              <Mantine.Table.Td>{activity.name}</Mantine.Table.Td>
              <Mantine.Table.Td>{activity.weight}%</Mantine.Table.Td>
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
    <Fragment>
      <Mantine.Box mb="sm">
        <Mantine.Title order={3}>Actividades</Mantine.Title>
        <Mantine.Text c="dimmed">
          Organiza y gestiona las actividades de cada periodo para tu clase.
        </Mantine.Text>
      </Mantine.Box>
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
                  {dayjs(period.dateStart).format("LL")} -{" "}
                  {dayjs(period.dateEnd).format("LL")}
                </Mantine.Text>
                <Mantine.Text c="dimmed">
                  ({period.activities.length} actividades)
                </Mantine.Text>
              </Mantine.Group>
              {renderActivitiesTable(period.activities)}
            </Mantine.Paper>
          ))
        )}
      </Mantine.Stack>
    </Fragment>
  );
}
