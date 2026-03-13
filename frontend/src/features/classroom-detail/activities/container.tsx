import { useState } from "react";
import { useParams } from "react-router";

import * as ActivitiesHooks from "./hooks";
import ActivitiesView from "./view";

import type {
  Activity,
  ActivityStatus,
  CreateActivityFormPayload,
  CreateActivityPayload,
  CreatePeriodFormPayload,
  CreatePeriodPayload,
  Period
} from "./types";

export default function ActivitiesContainer() {
  const { classroomId = "" } = useParams();
  const periodsQuery = ActivitiesHooks.usePeriods(classroomId);
  const activitiesQuery = ActivitiesHooks.useActivities(classroomId);
  const createPeriodMutation = ActivitiesHooks.useCreatePeriod(classroomId);
  const deletePeriodMutation = ActivitiesHooks.useDeletePeriod(classroomId);
  const createActivityMutation = ActivitiesHooks.useCreateActivity(classroomId);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ActivityStatus | null>(null);
  const [createPeriodOpened, setCreatePeriodOpened] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [createActivityPeriodId, setCreateActivityPeriodId] = useState<
    string | null
  >(null);

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
    {}
  );

  const periodsWithActivities: Period[] = periodsData.map((period) => ({
    ...period,
    activities: activitiesByPeriod[period.id] ?? []
  }));

  const normalizedQuery = query.trim().toLowerCase();

  const filteredPeriods = (
    !normalizedQuery
        ? periodsWithActivities
        : periodsWithActivities
          .map((period) => ({
            ...period,
            activities: period.activities.filter((activity) =>
              activity.name.toLowerCase().includes(normalizedQuery),
            ),
          }))
          .filter((period) => period.activities.length > 0)
  )
    .filter((period) => {
      if (!status) return true;
      return period.activities.some((activity) => activity.status === status);
    })
    .map((period) => {
      if (!status) return period;
      return {
        ...period,
        activities: period.activities.filter(
          (activity) => activity.status === status,
        ),
      };
    });

  const handleCreatePeriod = async (payload: CreatePeriodFormPayload) => {
    if (!classroomId) return;

    const requestPayload: CreatePeriodPayload = {
      label: payload.name,
      position: payload.position ?? 0
    };

    await createPeriodMutation.mutateAsync(requestPayload);
    setCreatePeriodOpened(false);
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

  const handleOpenCreateActivity = (periodId: string) => {
    setCreateActivityPeriodId(periodId);
  };

  const handleCloseCreateActivity = () => {
    setCreateActivityPeriodId(null);
  };

  const handleCreateActivity = async (payload: CreateActivityFormPayload) => {
    if (!classroomId || !createActivityPeriodId) return;

    const requestPayload: CreateActivityPayload = {
      periodId: createActivityPeriodId,
      label: payload.name,
      weight: payload.weightPercent / 100
    };

    await createActivityMutation.mutateAsync(requestPayload);
    handleCloseCreateActivity();
  };

  const renderView = () => (
    <ActivitiesView
      periods={filteredPeriods}
      query={query}
      status={status}
      isLoading={periodsQuery.isLoading || activitiesQuery.isLoading}
      errorMessage={
        periodsQuery.error?.message ??
        activitiesQuery.error?.message ??
        deletePeriodMutation.error?.message
      }
      createErrorMessage={createPeriodMutation.error?.message}
      createActivityErrorMessage={createActivityMutation.error?.message}
      deletingPeriodId={deletingId}
      onQueryChange={setQuery}
      onStatusChange={setStatus}
      createPeriodOpened={createPeriodOpened}
      onOpenCreatePeriod={() => setCreatePeriodOpened(true)}
      onCloseCreatePeriod={() => setCreatePeriodOpened(false)}
      onCreatePeriod={handleCreatePeriod}
      onDeletePeriod={handleDeletePeriod}
      isCreating={createPeriodMutation.isPending}
      createActivityPeriodId={createActivityPeriodId}
      onOpenCreateActivity={handleOpenCreateActivity}
      onCloseCreateActivity={handleCloseCreateActivity}
      onCreateActivity={handleCreateActivity}
      isCreatingActivity={createActivityMutation.isPending}
      periodsLookup={periodsWithActivities}
    />
  );

  return renderView();
}
