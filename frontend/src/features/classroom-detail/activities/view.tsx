import * as Mantine from "@mantine/core";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import es from "dayjs/locale/es";
import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";

import { Fragment } from "react";

import CreateActivity from "./components/create-activity";
import CreatePeriod from "./components/create-period";
import type {
  Activity,
  CreateActivityFormPayload,
  CreatePeriodFormPayload,
  Period,
} from "./types";

dayjs.extend(localizedFormat);
dayjs.locale(es);

type ActivitiesViewProps = {
  periods: Period[];
  query: string;
  isLoading: boolean;
  isCreating: boolean;
  isCreatingActivity: boolean;
  deletingPeriodId?: string | null;
  deletingActivityId?: string | null;
  createActivityPeriodId?: string | null;
  editingPeriod?: Period | null;
  editingActivity?: Activity | null;
  periodsLookup: Period[];
  createPeriodOpened: boolean;
  errorMessage?: string;
  createErrorMessage?: string;
  createActivityErrorMessage?: string;
  inlineForms: Record<
    string,
    {
      name: string;
      weightPercent: string;
      limitDate: string;
    }
  >;
  onQueryChange: (value: string) => void;
  onOpenCreatePeriod: () => void;
  onOpenEditPeriod: (period: Period) => void;
  onCloseCreatePeriod: () => void;
  onCreatePeriod: (payload: CreatePeriodFormPayload) => void;
  onOpenEditActivity: (activity: Activity) => void;
  onCloseCreateActivity: () => void;
  onCreateActivity: (payload: CreateActivityFormPayload) => void;
  onInlineFieldChange: (
    periodId: string,
    field: "name" | "weightPercent" | "limitDate",
    value: string,
  ) => void;
  onInlineCreateActivity: (periodId: string) => void;
  onDeletePeriod: (periodId: string, periodName: string) => void;
  onDeleteActivity: (activityId: string, activityName: string) => void;
};

export default function ActivitiesView({
  periods,
  query,
  isLoading,
  isCreating,
  isCreatingActivity,
  deletingPeriodId,
  deletingActivityId,
  createActivityPeriodId,
  editingPeriod,
  editingActivity,
  periodsLookup,
  createPeriodOpened,
  errorMessage,
  createErrorMessage,
  createActivityErrorMessage,
  inlineForms,
  onQueryChange,
  onOpenCreatePeriod,
  onOpenEditPeriod,
  onCloseCreatePeriod,
  onCreatePeriod,
  onOpenEditActivity,
  onCloseCreateActivity,
  onCreateActivity,
  onInlineFieldChange,
  onInlineCreateActivity,
  onDeletePeriod,
  onDeleteActivity,
}: ActivitiesViewProps) {
  const activePeriod = periodsLookup.find(
    (period) => period.id === createActivityPeriodId,
  );

  const renderActivitiesTable = (
    periodId: string,
    activities: Activity[],
    periodIndex: number,
  ) => {
    const inlineForm = inlineForms[periodId] ?? {
      name: "",
      weightPercent: "",
      limitDate: "",
    };

    return (
      <Mantine.Table striped highlightOnHover>
        <Mantine.Table.Thead>
          <Mantine.Table.Tr>
            <Mantine.Table.Th>Nombre de actividad</Mantine.Table.Th>
            <Mantine.Table.Th ta="end">Ponderación</Mantine.Table.Th>
            <Mantine.Table.Th ta="center">Fecha limite</Mantine.Table.Th>
            <Mantine.Table.Th ta="center">Acciones</Mantine.Table.Th>
          </Mantine.Table.Tr>
        </Mantine.Table.Thead>
        <Mantine.Table.Tbody>
          {activities.map((activity, activityIndex) => (
            <Mantine.Table.Tr
              key={activity.id}
              data-testid={`activities-row-${activityIndex}`}
            >
              <Mantine.Table.Td w="50%">{activity.name}</Mantine.Table.Td>
              <Mantine.Table.Td w={100} ta="end">
                {(activity.weight * 100).toFixed(0)}%
              </Mantine.Table.Td>
              <Mantine.Table.Td w={150} ta="center">
                <Mantine.Badge
                  variant="light"
                  color={
                    activity.limitDate < dayjs().toISOString() ? "red" : "lime"
                  }
                >
                  {dayjs(activity.limitDate).format("LL")}
                </Mantine.Badge>
              </Mantine.Table.Td>
              <Mantine.Table.Td w={120} ta="end">
                <Mantine.Group gap={4} justify="flex-end">
                  <Mantine.ActionIcon
                    variant="default"
                    onClick={() => onOpenEditActivity(activity)}
                    aria-label="Editar actividad"
                    data-testid={`activities-edit-${activityIndex}-button`}
                  >
                    <Pencil style={{ width: 14, height: 14 }} />
                  </Mantine.ActionIcon>
                  <Mantine.ActionIcon
                    variant="default"
                    onClick={() => onDeleteActivity(activity.id, activity.name)}
                    disabled={deletingActivityId === activity.id}
                    aria-label="Eliminar actividad"
                    data-testid={`activities-delete-${activityIndex}-button`}
                  >
                    <Trash2 style={{ width: 14, height: 14 }} />
                  </Mantine.ActionIcon>
                </Mantine.Group>
              </Mantine.Table.Td>
            </Mantine.Table.Tr>
          ))}
          <Mantine.Table.Tr>
            <Mantine.Table.Td>
              <Mantine.TextInput
                placeholder="Nombre de la actividad"
                value={inlineForm.name}
                onChange={(event) =>
                  onInlineFieldChange(
                    periodId,
                    "name",
                    event.currentTarget.value,
                  )
                }
                data-testid={`activities-inline-name-${periodIndex}-input`}
              />
            </Mantine.Table.Td>
            <Mantine.Table.Td>
              <Mantine.NumberInput
                placeholder="Ponderación"
                suffix="%"
                min={0}
                max={100}
                clampBehavior="strict"
                step={1}
                value={inlineForm.weightPercent}
                onChange={(value) =>
                  onInlineFieldChange(
                    periodId,
                    "weightPercent",
                    value === "" ? "" : String(value),
                  )
                }
                data-testid={`activities-inline-weight-${periodIndex}-input`}
              />
            </Mantine.Table.Td>
            <Mantine.Table.Td>
              <DateInput
                value={
                  inlineForm.limitDate
                    ? dayjs(inlineForm.limitDate).toDate()
                    : null
                }
                onChange={(value) =>
                  onInlineFieldChange(
                    periodId,
                    "limitDate",
                    value ? dayjs(value).format("YYYY-MM-DD") : "",
                  )
                }
                clearable
                placeholder="Fecha límite de entrega"
                data-testid={`activities-inline-limit-${periodIndex}-input`}
              />
            </Mantine.Table.Td>
            <Mantine.Table.Td ta="end">
              <Mantine.Button
                variant="light"
                onClick={() => onInlineCreateActivity(periodId)}
                data-testid={`activities-create-activity-${periodIndex}-button`}
                rightSection={<Plus />}
                loading={isCreatingActivity}
              >
                Guardar
              </Mantine.Button>
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
          <Mantine.Button
            onClick={onOpenCreatePeriod}
            data-testid="activities-create-period-button"
            leftSection={<Plus />}
          >
            Agregar periodo
          </Mantine.Button>
        </Mantine.Group>

        {errorMessage ? (
          <Mantine.Alert color="red" mt="md" variant="light">
            {errorMessage}
          </Mantine.Alert>
        ) : null}

        {isLoading ? (
          <Mantine.Center mt="md">
            <Mantine.Loader size="md" />
          </Mantine.Center>
        ) : periods.length === 0 ? (
          <Mantine.Box ta="center" mt="xl">
            <Mantine.Title order={3}>Sin resultados</Mantine.Title>
            <Mantine.Text c="dimmed">
              No se encontraron actividades para la busqueda actual.
            </Mantine.Text>
          </Mantine.Box>
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
                <Mantine.Menu
                  shadow="md"
                  width={170}
                  position="bottom-end"
                  withinPortal
                >
                  <Mantine.Menu.Target>
                    <Mantine.ActionIcon
                      variant="subtle"
                      aria-label="Opciones del periodo"
                      data-testid={`activities-period-actions-${index}-button`}
                    >
                      <MoreVertical size={16} />
                    </Mantine.ActionIcon>
                  </Mantine.Menu.Target>

                  <Mantine.Menu.Dropdown>
                    <Mantine.Menu.Item
                      leftSection={<Pencil style={{ width: 14, height: 14 }} />}
                      onClick={() => onOpenEditPeriod(period)}
                      data-testid={`activities-period-edit-${index}-button`}
                    >
                      Editar
                    </Mantine.Menu.Item>
                    <Mantine.Menu.Item
                      color="red"
                      leftSection={<Trash2 style={{ width: 14, height: 14 }} />}
                      onClick={() => onDeletePeriod(period.id, period.name)}
                      disabled={deletingPeriodId === period.id}
                      data-testid={`activities-period-delete-${index}-button`}
                    >
                      Eliminar
                    </Mantine.Menu.Item>
                  </Mantine.Menu.Dropdown>
                </Mantine.Menu>
              </Mantine.Group>
              {renderActivitiesTable(period.id, period.activities, index)}
            </Mantine.Paper>
          ))
        )}
      </Mantine.Stack>

      <CreatePeriod
        key={editingPeriod?.id ?? "new-period"}
        opened={createPeriodOpened}
        mode={editingPeriod ? "edit" : "create"}
        initialValues={
          editingPeriod
            ? {
                name: editingPeriod.name,
                startDate: editingPeriod.startDate,
                finishDate: editingPeriod.finishDate,
              }
            : undefined
        }
        onClose={onCloseCreatePeriod}
        onSave={onCreatePeriod}
        isSaving={isCreating}
        errorMessage={createErrorMessage}
      />

      <CreateActivity
        key={`${createActivityPeriodId ?? "closed"}-${editingActivity?.id ?? "edit"}`}
        opened={Boolean(editingActivity)}
        periodName={activePeriod?.name ?? "Periodo"}
        mode="edit"
        initialValues={
          editingActivity
            ? {
                name: editingActivity.name,
                weightPercent: Math.round(editingActivity.weight * 100),
                limitDate: editingActivity.limitDate,
              }
            : undefined
        }
        onClose={onCloseCreateActivity}
        onSave={onCreateActivity}
        isSaving={isCreatingActivity}
        errorMessage={createActivityErrorMessage}
      />
    </Fragment>
  );
}
