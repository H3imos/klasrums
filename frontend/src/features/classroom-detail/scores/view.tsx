import * as Mantine from "@mantine/core";
import { Fragment } from "react";

import type { ScorePeriod, ScoreStudent } from "./types";

type ScoresViewProps = {
  periods: ScorePeriod[];
  students: ScoreStudent[];
  drafts: Record<string, string>;
  scoresByCell: Record<string, number>;
  savingCellKey?: string | null;
  isLoading: boolean;
  errorMessage?: string;
  onDraftChange: (
    studentId: string,
    activityId: string,
    value: string | number,
  ) => void;
  onCellSave: (studentId: string, activityId: string) => void;
};

const buildCellKey = (studentId: string, activityId: string) =>
  `${studentId}:${activityId}`;

const toFixed = (value: number) => value.toFixed(2);

export default function ScoresView({
  periods,
  students,
  drafts,
  scoresByCell,
  savingCellKey,
  isLoading,
  errorMessage,
  onDraftChange,
  onCellSave,
}: ScoresViewProps) {
  const periodColumns = periods.flatMap((period) => [
    ...period.activities.map((activity) => ({
      key: activity.id,
      label: activity.label,
      periodId: period.id,
      type: "activity" as const,
      weight: activity.weight,
    })),
    {
      key: `${period.id}-prom`,
      label: "Final",
      periodId: period.id,
      type: "period-final" as const,
      weight: 0,
    },
  ]);

  const getPersistedScore = (studentId: string, activityId: string) =>
    scoresByCell[buildCellKey(studentId, activityId)] ?? 0;

  const getPeriodFinal = (studentId: string, periodId: string) => {
    const period = periods.find((item) => item.id === periodId);

    if (!period) return 0;

    return period.activities.reduce(
      (acc, activity) =>
        acc + getPersistedScore(studentId, activity.id) * activity.weight,
      0,
    );
  };

  const getStudentAverage = (studentId: string) => {
    const totalActivities = periods.flatMap((period) => period.activities);

    if (totalActivities.length === 0) {
      return 0;
    }

    const total = totalActivities.reduce(
      (acc, activity) => acc + getPersistedScore(studentId, activity.id),
      0,
    );

    return total / totalActivities.length;
  };

  const getActivityAverage = (activityId: string) => {
    if (students.length === 0) {
      return 0;
    }

    const total = students.reduce(
      (acc, student) => acc + getPersistedScore(student.id, activityId),
      0,
    );

    return total / students.length;
  };

  const getPeriodColumnAverage = (periodId: string) => {
    if (students.length === 0) {
      return 0;
    }

    const total = students.reduce(
      (acc, student) => acc + getPeriodFinal(student.id, periodId),
      0,
    );

    return total / students.length;
  };

  const overallAverage =
    students.length === 0
      ? 0
      : students.reduce(
          (acc, student) => acc + getStudentAverage(student.id),
          0,
        ) / students.length;

  const getDisplayedValue = (studentId: string, activityId: string): string => {
    const key = buildCellKey(studentId, activityId);
    if (drafts[key] !== undefined) return drafts[key];

    const persisted = scoresByCell[key];
    return persisted === undefined ? "" : persisted.toString();
  };

  const renderComponent = () => {
    return (
      <Fragment>
        <Mantine.Box mb="sm">
          <Mantine.Title order={3}>Calificaciones</Mantine.Title>
          <Mantine.Text c="dimmed">
            Gestiona las calificaciones de los estudiantes por actividad y
            periodo.
          </Mantine.Text>
        </Mantine.Box>

        {errorMessage ? (
          <Mantine.Alert color="red" mb="sm" variant="light">
            {errorMessage}
          </Mantine.Alert>
        ) : null}

        {isLoading ? (
          <Mantine.Center mt="md">
            <Mantine.Loader size="md" />
          </Mantine.Center>
        ) : (
          <Mantine.Paper withBorder p="md">
            <Mantine.Table.ScrollContainer minWidth={980}>
              <Mantine.Table withColumnBorders highlightOnHover>
                <Mantine.Table.Thead>
                  <Mantine.Table.Tr>
                    <Mantine.Table.Th rowSpan={2}>Estudiante</Mantine.Table.Th>
                    {periods.map((period) => (
                      <Mantine.Table.Th
                        key={period.id}
                        colSpan={period.activities.length + 1}
                        ta="center"
                      >
                        {period.label}
                      </Mantine.Table.Th>
                    ))}
                    <Mantine.Table.Th rowSpan={2} ta="center">
                      Promedio
                    </Mantine.Table.Th>
                  </Mantine.Table.Tr>
                  <Mantine.Table.Tr>
                    {periodColumns.map((column, index) => (
                      <Mantine.Table.Th key={column.key} ta="center">
                        <Mantine.Tooltip label={column.label}>
                          <div>A{index + 1}</div>
                        </Mantine.Tooltip>
                      </Mantine.Table.Th>
                    ))}
                  </Mantine.Table.Tr>
                </Mantine.Table.Thead>

                <Mantine.Table.Tbody>
                  {students.map((student, studentIndex) => (
                    <Mantine.Table.Tr
                      key={student.id}
                      data-testid={`scores-row-${studentIndex}`}
                    >
                      <Mantine.Table.Td fw={600}>
                        {student.fullName}
                      </Mantine.Table.Td>
                      {periodColumns.map((column) =>
                        column.type === "activity" ? (
                          <Mantine.Table.Td
                            className="focus-cell"
                            key={`${student.id}-${column.key}`}
                            w={75}
                            p={0}
                          >
                            <Mantine.NumberInput
                              variant="unstyled"
                              value={getDisplayedValue(student.id, column.key)}
                              h="100%"
                              w="100%"
                              allowDecimal
                              min={0}
                              max={5}
                              clampBehavior="strict"
                              step={0.01}
                              fixedDecimalScale
                              decimalScale={2}
                              allowNegative={false}
                              styles={{
                                input: { textAlign: "center" },
                              }}
                              disabled={
                                savingCellKey ===
                                buildCellKey(student.id, column.key)
                              }
                              onChange={(value) =>
                                onDraftChange(student.id, column.key, value)
                              }
                              onBlur={() => onCellSave(student.id, column.key)}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  void onCellSave(student.id, column.key);
                                }
                              }}
                            />
                          </Mantine.Table.Td>
                        ) : (
                          <Mantine.Table.Td
                            key={`${student.id}-${column.key}`}
                            ta="center"
                            fw={600}
                            bg="gray.0"
                          >
                            {toFixed(
                              getPeriodFinal(student.id, column.periodId),
                            )}
                          </Mantine.Table.Td>
                        ),
                      )}
                      <Mantine.Table.Td ta="center" fw={600}>
                        {toFixed(getStudentAverage(student.id))}
                      </Mantine.Table.Td>
                    </Mantine.Table.Tr>
                  ))}
                </Mantine.Table.Tbody>

                <Mantine.Table.Tfoot bg="gray.0">
                  <Mantine.Table.Tr>
                    <Mantine.Table.Td fw={600}>
                      Promedio por actividad
                    </Mantine.Table.Td>
                    {periodColumns.map((column) =>
                      column.type === "activity" ? (
                        <Mantine.Table.Td
                          key={`avg-${column.key}`}
                          ta="center"
                          fw={600}
                        >
                          {toFixed(getActivityAverage(column.key))}
                        </Mantine.Table.Td>
                      ) : (
                        <Mantine.Table.Td
                          key={`period-avg-${column.periodId}`}
                          ta="center"
                          fw={600}
                          bg="gray.0"
                        >
                          {toFixed(getPeriodColumnAverage(column.periodId))}
                        </Mantine.Table.Td>
                      ),
                    )}
                    <Mantine.Table.Td ta="center" fw={600}>
                      {toFixed(overallAverage)}
                    </Mantine.Table.Td>
                  </Mantine.Table.Tr>
                </Mantine.Table.Tfoot>
              </Mantine.Table>
            </Mantine.Table.ScrollContainer>
          </Mantine.Paper>
        )}
      </Fragment>
    );
  };

  return renderComponent();
}
