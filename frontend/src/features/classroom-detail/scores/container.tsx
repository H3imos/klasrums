import { useMemo, useState } from "react";
import { useParams } from "react-router";

import * as ScoresHooks from "./hooks";
import ScoresView from "./view";

import type { ScoreActivity, ScorePeriod, SaveScorePayload } from "./types";

const buildCellKey = (studentId: string, activityId: string) =>
  `${studentId}:${activityId}`;

export default function ScoresContainer() {
  const { classroomId = "" } = useParams();

  const periodsQuery = ScoresHooks.usePeriods(classroomId);
  const activitiesQuery = ScoresHooks.useActivities(classroomId);
  const studentsQuery = ScoresHooks.useStudents(classroomId);
  const scoresQuery = ScoresHooks.useScores(classroomId);
  const saveScoreMutation = ScoresHooks.useSaveScore(classroomId);

  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingCellKey, setSavingCellKey] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  );

  const periods = periodsQuery.data ?? [];
  const activities = activitiesQuery.data ?? [];
  const students = studentsQuery.data ?? [];
  const scores = scoresQuery.data ?? [];

  const scoresByCell = useMemo(() => {
    return scores.reduce<Record<string, number>>((acc, score) => {
      acc[buildCellKey(score.studentId, score.activityId)] = score.score;
      return acc;
    }, {});
  }, [scores]);

  const periodsWithActivities: ScorePeriod[] = useMemo(() => {
    const byPeriod = activities.reduce<Record<string, ScoreActivity[]>>(
      (acc, activity) => {
        if (!acc[activity.periodId]) {
          acc[activity.periodId] = [];
        }

        acc[activity.periodId].push(activity);
        return acc;
      },
      {},
    );

    return periods.map((period) => ({
      ...period,
      activities: byPeriod[period.id] ?? [],
    }));
  }, [activities, periods]);

  const handleDraftChange = (
    studentId: string,
    activityId: string,
    value: string | number,
  ) => {
    const key = buildCellKey(studentId, activityId);
    setDrafts((current) => ({ ...current, [key]: `${value}` }));
    setValidationMessage(null);
  };

  const handleCellSave = async (studentId: string, activityId: string) => {
    if (!classroomId) return;

    const key = buildCellKey(studentId, activityId);
    const draftValue = drafts[key];

    if (draftValue === undefined) {
      return;
    }

    const trimmed = draftValue.trim();

    let payload: SaveScorePayload;

    if (!trimmed) {
      payload = {
        studentId,
        activityId,
        score: null,
      };
    } else {
      const numeric = Number(trimmed.replace(",", "."));

      if (!Number.isFinite(numeric) || numeric < 0 || numeric > 5) {
        setValidationMessage("La nota debe estar entre 0 y 5 o vacia.");
        return;
      }

      payload = {
        studentId,
        activityId,
        score: Number(numeric.toFixed(2)),
      };
    }

    setSavingCellKey(key);

    try {
      await saveScoreMutation.mutateAsync(payload);
      setDrafts((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    } finally {
      setSavingCellKey(null);
    }
  };

  const errorMessage =
    periodsQuery.error?.message ??
    activitiesQuery.error?.message ??
    studentsQuery.error?.message ??
    scoresQuery.error?.message ??
    saveScoreMutation.error?.message ??
    validationMessage ??
    undefined;

  return (
    <ScoresView
      periods={periodsWithActivities}
      students={students}
      drafts={drafts}
      scoresByCell={scoresByCell}
      savingCellKey={savingCellKey}
      isLoading={
        periodsQuery.isLoading ||
        activitiesQuery.isLoading ||
        studentsQuery.isLoading ||
        scoresQuery.isLoading
      }
      errorMessage={errorMessage}
      onDraftChange={handleDraftChange}
      onCellSave={handleCellSave}
    />
  );
}
