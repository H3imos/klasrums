import { useState } from "react";
import { useParams } from "react-router";
import { modals } from "@mantine/modals";

import * as ActivitiesHooks from "./hooks";
import ActivitiesView from "./view";

import type {
  Activity,
  CreateActivityFormPayload,
  CreateActivityPayload,
  CreatePeriodFormPayload,
  CreatePeriodPayload,
  Period,
} from "./types";

type InlineActivityForm = {
  name: string;
  weightPercent: string;
  limitDate: string;
};

const emptyInlineForm: InlineActivityForm = {
  name: "",
  weightPercent: "",
  limitDate: "",
};

export default function ActivitiesContainer() {
  const { classroomId = "" } = useParams();
  const periodsQuery = ActivitiesHooks.usePeriods(classroomId);
  const activitiesQuery = ActivitiesHooks.useActivities(classroomId);
  const createPeriodMutation = ActivitiesHooks.useCreatePeriod(classroomId);
  const updatePeriodMutation = ActivitiesHooks.useUpdatePeriod(classroomId);
  const deletePeriodMutation = ActivitiesHooks.useDeletePeriod(classroomId);
  const createActivityMutation = ActivitiesHooks.useCreateActivity(classroomId);
  const deleteActivityMutation = ActivitiesHooks.useDeleteActivity(classroomId);
  const updateActivityMutation = ActivitiesHooks.useUpdateActivity(classroomId);

  const [query, setQuery] = useState("");
  const [createPeriodOpened, setCreatePeriodOpened] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingActivityId, setDeletingActivityId] = useState<string | null>(
    null,
  );
  const [createActivityPeriodId, setCreateActivityPeriodId] = useState<
    string | null
  >(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [inlineForms, setInlineForms] = useState<
    Record<string, InlineActivityForm>
  >({});

  const periodsData = periodsQuery.data ?? [];
  const activitiesData = activitiesQuery.data ?? [];

  const activitiesByPeriod = activitiesData.reduce<Record<string, Activity[]>>(
    (acc, activity) => {
      if (!acc[activity.periodId]) {
        acc[activity.periodId] = [];
      }

      acc[activity.periodId].push(activity);
      return acc;
    },
    {},
  );

  const periodsWithActivities: Period[] = periodsData.map((period) => ({
    ...period,
    activities: activitiesByPeriod[period.id] ?? [],
  }));

  const normalizedQuery = query.trim().toLowerCase();

  const filteredPeriods = !normalizedQuery
    ? periodsWithActivities
    : periodsWithActivities
        .map((period) => ({
          ...period,
          activities: period.activities.filter((activity) =>
            activity.name.toLowerCase().includes(normalizedQuery),
          ),
        }))
        .filter((period) => period.activities.length > 0);

  const handleSavePeriod = async (payload: CreatePeriodFormPayload) => {
    if (!classroomId) return;

    if (editingPeriod) {
      await updatePeriodMutation.mutateAsync({
        id: editingPeriod.id,
        payload: {
          label: payload.name,
          startDate: payload.startDate,
          finishDate: payload.finishDate,
        },
      });
      return;
    }

    const requestPayload: CreatePeriodPayload = {
      label: payload.name,
      startDate: payload.startDate,
      finishDate: payload.finishDate,
    };

    await createPeriodMutation.mutateAsync(requestPayload);
  };

  const handleOpenCreatePeriod = () => {
    setEditingPeriod(null);
    setCreatePeriodOpened(true);
  };

  const handleOpenEditPeriod = (period: Period) => {
    setEditingPeriod(period);
    setCreatePeriodOpened(true);
  };

  const handleClosePeriodModal = () => {
    setCreatePeriodOpened(false);
    setEditingPeriod(null);
  };

  const handleDeletePeriod = async (periodId: string) => {
    if (!classroomId) return;
    setDeletingId(periodId);

    try {
      await deletePeriodMutation.mutateAsync(periodId);
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setCreateActivityPeriodId(activity.periodId);
  };

  const handleCloseCreateActivity = () => {
    setCreateActivityPeriodId(null);
    setEditingActivity(null);
  };

  const handleSaveActivity = async (payload: CreateActivityFormPayload) => {
    if (!classroomId || !createActivityPeriodId || !editingActivity) return;

    await updateActivityMutation.mutateAsync({
      id: editingActivity.id,
      payload: {
        periodId: createActivityPeriodId,
        label: payload.name,
        weight: payload.weightPercent / 100,
        limitDate: payload.limitDate,
      },
    });
  };

  const handleInlineFieldChange = (
    periodId: string,
    field: keyof InlineActivityForm,
    value: string,
  ) => {
    setInlineForms((current) => ({
      ...current,
      [periodId]: {
        ...(current[periodId] ?? emptyInlineForm),
        [field]: value,
      },
    }));
  };

  const handleInlineCreateActivity = async (periodId: string) => {
    if (!classroomId) return;

    const form = inlineForms[periodId] ?? emptyInlineForm;
    const weight = Number(form.weightPercent);

    if (!form.name.trim() || !form.limitDate || !Number.isFinite(weight)) {
      return;
    }

    const requestPayload: CreateActivityPayload = {
      periodId,
      label: form.name.trim(),
      weight: weight / 100,
      limitDate: form.limitDate,
    };

    await createActivityMutation.mutateAsync(requestPayload);

    setInlineForms((current) => ({
      ...current,
      [periodId]: emptyInlineForm,
    }));
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!classroomId) return;
    setDeletingActivityId(activityId);

    try {
      await deleteActivityMutation.mutateAsync(activityId);
    } finally {
      setDeletingActivityId(null);
    }
  };

  const handleRequestDeletePeriod = (periodId: string, periodName: string) => {
    modals.openConfirmModal({
      title: "Eliminar periodo",
      children: `¿Estás seguro de eliminar el periodo ${periodName}? Esta acción no se puede deshacer.`,
      labels: {
        confirm: "Eliminar",
        cancel: "Cancelar",
      },
      confirmProps: { color: "red" },
      onConfirm: () => handleDeletePeriod(periodId),
    });
  };

  const handleRequestDeleteActivity = (
    activityId: string,
    activityName: string,
  ) => {
    modals.openConfirmModal({
      title: "Eliminar actividad",
      children: `¿Estás seguro de eliminar la actividad ${activityName}? Esta acción no se puede deshacer.`,
      labels: {
        confirm: "Eliminar",
        cancel: "Cancelar",
      },
      confirmProps: { color: "red" },
      onConfirm: () => handleDeleteActivity(activityId),
    });
  };

  const renderView = () => (
    <ActivitiesView
      periods={filteredPeriods}
      query={query}
      isLoading={periodsQuery.isLoading || activitiesQuery.isLoading}
      errorMessage={
        periodsQuery.error?.message ??
        activitiesQuery.error?.message ??
        createPeriodMutation.error?.message ??
        updatePeriodMutation.error?.message ??
        deletePeriodMutation.error?.message ??
        deleteActivityMutation.error?.message ??
        updateActivityMutation.error?.message
      }
      createErrorMessage={
        createPeriodMutation.error?.message ??
        updatePeriodMutation.error?.message
      }
      createActivityErrorMessage={
        createActivityMutation.error?.message ??
        updateActivityMutation.error?.message
      }
      deletingPeriodId={deletingId}
      deletingActivityId={deletingActivityId}
      onQueryChange={setQuery}
      createPeriodOpened={createPeriodOpened}
      editingPeriod={editingPeriod}
      onOpenCreatePeriod={handleOpenCreatePeriod}
      onOpenEditPeriod={handleOpenEditPeriod}
      onCloseCreatePeriod={handleClosePeriodModal}
      onCreatePeriod={handleSavePeriod}
      onDeletePeriod={handleRequestDeletePeriod}
      onDeleteActivity={handleRequestDeleteActivity}
      inlineForms={inlineForms}
      onInlineFieldChange={handleInlineFieldChange}
      onInlineCreateActivity={handleInlineCreateActivity}
      isCreating={
        createPeriodMutation.isPending || updatePeriodMutation.isPending
      }
      createActivityPeriodId={createActivityPeriodId}
      editingActivity={editingActivity}
      onOpenEditActivity={handleOpenEditActivity}
      onCloseCreateActivity={handleCloseCreateActivity}
      onCreateActivity={handleSaveActivity}
      isCreatingActivity={
        createActivityMutation.isPending || updateActivityMutation.isPending
      }
      periodsLookup={periodsWithActivities}
    />
  );

  return renderView();
}
