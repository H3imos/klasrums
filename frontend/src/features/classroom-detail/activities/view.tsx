import * as Mantine from "@mantine/core";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import es from "dayjs/locale/es";
import { Plus, Trash2 } from "lucide-react";

import { Fragment } from "react";

import CreateActivity from "./components/create-activity";
import CreatePeriod from "./components/create-period";
import type {
  Activity,
  ActivityStatus,
  CreateActivityFormPayload,
  CreatePeriodFormPayload,
  Period,
} from "./types";

dayjs.extend(localizedFormat);
dayjs.locale(es);

type ActivitiesViewProps = {
  periods: Period[];
  query: string;
  status: ActivityStatus | null;
  isLoading: boolean;
  isCreating: boolean;
  isCreatingActivity: boolean;
  deletingPeriodId?: string | null;
  createActivityPeriodId?: string | null;
  periodsLookup: Period[];
  createPeriodOpened: boolean;
  errorMessage?: string;
  createErrorMessage?: string;
  createActivityErrorMessage?: string;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: ActivityStatus | null) => void;
  onOpenCreatePeriod: () => void;
  onCloseCreatePeriod: () => void;
  onCreatePeriod: (payload: CreatePeriodFormPayload) => void;
  onOpenCreateActivity: (periodId: string) => void;
  onCloseCreateActivity: () => void;
  onCreateActivity: (payload: CreateActivityFormPayload) => void;
  onDeletePeriod: (periodId: string) => void;
};

export default function ActivitiesView({
  periods,
  query,
  status,
  isLoading,
  isCreating,
  isCreatingActivity,
  deletingPeriodId,
  createActivityPeriodId,
  periodsLookup,
  createPeriodOpened,
  errorMessage,
  createErrorMessage,
  createActivityErrorMessage,
  onQueryChange,
  onStatusChange,
  onOpenCreatePeriod,
  onCloseCreatePeriod,
  onCreatePeriod,
  onOpenCreateActivity,
  onCloseCreateActivity,
  onCreateActivity,
  onDeletePeriod,
}: ActivitiesViewProps) {
  const activePeriod = periodsLookup.find(
    (period) => period.id === createActivityPeriodId,
  );

  const renderActivitiesTable = (
    periodId: string,
    activities: Activity[],
    periodIndex: number,
  ) => {
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
          {activities.map((activity, index) => (
            <Mantine.Table.Tr
              key={activity.id}
              data-testid={`activities-row-${index}`}
            >
              <Mantine.Table.Td>{activity.name}</Mantine.Table.Td>
              <Mantine.Table.Td>
                {(activity.weight * 100).toFixed(0)}%
              </Mantine.Table.Td>
              <Mantine.Table.Td>
                {activity.limitDate
                  ? dayjs(activity.limitDate).format("LL")
                  : "Sin fecha"}
              </Mantine.Table.Td>
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
          <Mantine.Table.Tr
            data-testid={`activities-create-row-${periodIndex}`}
          >
            <Mantine.Table.Td colSpan={4}>
              <Mantine.Center>
                <Mantine.Button
                  variant="transparent"
                  onClick={() => onOpenCreateActivity(periodId)}
                  data-testid={`activities-create-activity-${periodIndex}-button`}
                  rightSection={<Plus />}
                >
                  Crear actividad
                </Mantine.Button>
              </Mantine.Center>
            </Mantine.Table.Td>
          </Mantine.Table.Tr>
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
            onChange={(event) => onQueryChange(event.currentTarget.value)}
            flex={1}
            data-testid="activities-search-input"
          />
          <Mantine.Select
            placeholder="Seleccionar estado"
            data-testid="activities-status-select"
            data={["Abierta", "Cerrada"]}
            value={status}
            onChange={(value) =>
              onStatusChange(value === null ? null : (value as ActivityStatus))
            }
          />
          <Mantine.Button
            onClick={onOpenCreatePeriod}
            data-testid="activities-create-period-button"
          >
            Crear periodo
          </Mantine.Button>
        </Mantine.Group>

        {errorMessage ? (
          <Mantine.Alert color="red" mt="md" variant="light">
            {errorMessage}
          </Mantine.Alert>
        ) : null}

        <CreatePeriod
          opened={createPeriodOpened}
          onClose={onCloseCreatePeriod}
          onSave={onCreatePeriod}
          isSaving={isCreating}
          errorMessage={createErrorMessage}
        />

        <CreateActivity
          opened={Boolean(createActivityPeriodId)}
          periodName={activePeriod?.name ?? "Periodo"}
          onClose={onCloseCreateActivity}
          onSave={onCreateActivity}
          isSaving={isCreatingActivity}
          errorMessage={createActivityErrorMessage}
        />

        {isLoading ? (
          <Mantine.Center mt="md">
            <Mantine.Loader size="md" />
          </Mantine.Center>
        ) : periods.length === 0 ? (
          <Mantine.Alert color="gray" title="Sin resultados">
            No se encontraron actividades para la busqueda actual.
          </Mantine.Alert>
        ) : (
          periods.map((period, index) => (
            <Mantine.Paper key={period.id} withBorder p="md">
              <Mantine.Group align="center" mb="sm" justify="space-between">
                <Mantine.Group align="center">
                  <Mantine.Title order={4}>{period.name}</Mantine.Title>
                  <Mantine.Text c="dimmed">
                    {period.startDate && period.finishDate
                      ? `${dayjs(period.startDate).format("LL")} - ${dayjs(period.finishDate).format("LL")}`
                      : "Sin fechas"}
                  </Mantine.Text>
                  <Mantine.Text c="dimmed">
                    ({period.activities.length} actividades)
                  </Mantine.Text>
                </Mantine.Group>
                <Mantine.ActionIcon
                  color="red"
                  variant="subtle"
                  onClick={() => onDeletePeriod(period.id)}
                  disabled={deletingPeriodId === period.id}
                  data-testid={`activities-period-delete-${index}-button`}
                >
                  <Trash2 size={16} />
                </Mantine.ActionIcon>
              </Mantine.Group>
              {renderActivitiesTable(period.id, period.activities, index)}
            </Mantine.Paper>
          ))
        )}
      </Mantine.Stack>
    </Fragment>
  );
}
