import * as Mantine from "@mantine/core";
import { Fragment, useState } from "react";

import { type StudentScores, scoresMock } from "./mock";

export default function ScoresView() {
  const [students, setStudents] = useState<StudentScores[]>(
    scoresMock.students,
  );

  const periodColumns = scoresMock.periods.flatMap((period) => [
    ...period.activities.map((activity) => ({
      key: activity.id,
      label: activity.label,
      periodId: period.id,
      type: "activity" as const,
    })),
    {
      key: `${period.id}-prom`,
      label: "Final",
      periodId: period.id,
      type: "period-final" as const,
    },
  ]);

  const toFixed = (value: number) => value.toFixed(2);

  const getPeriodFinal = (grades: Record<string, number>, periodId: string) => {
    const period = scoresMock.periods.find((item) => item.id === periodId);

    if (!period) return 0;

    return period.activities.reduce(
      (acc, activity) => acc + (grades[activity.id] ?? 0) * activity.weight,
      0,
    );
  };

  const getStudentAverage = (grades: Record<string, number>) => {
    const totalActivities = scoresMock.periods.flatMap(
      (period) => period.activities,
    );
    const total = totalActivities.reduce(
      (acc, activity) => acc + (grades[activity.id] ?? 0),
      0,
    );
    return total / totalActivities.length;
  };

  const getActivityAverage = (activityId: string) => {
    const total = students.reduce(
      (acc, student) => acc + (student.grades[activityId] ?? 0),
      0,
    );
    return total / students.length;
  };

  const getPeriodColumnAverage = (periodId: string) => {
    const total = students.reduce(
      (acc, student) => acc + getPeriodFinal(student.grades, periodId),
      0,
    );

    return total / students.length;
  };

  const overallAverage =
    students.reduce(
      (acc, student) => acc + getStudentAverage(student.grades),
      0,
    ) / students.length;

  const handleGradeChange = (
    studentId: string,
    activityId: string,
    nextValue: string | number,
  ) => {
    const parsedValue =
      typeof nextValue === "number" ? nextValue : Number(nextValue);
    const safeValue = Number.isFinite(parsedValue)
      ? Math.min(5, Math.max(0, parsedValue))
      : 0;

    setStudents((current) =>
      current.map((student) => {
        if (student.id !== studentId) return student;

        return {
          ...student,
          grades: {
            ...student.grades,
            [activityId]: safeValue,
          },
        };
      }),
    );
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
        <Mantine.Paper withBorder p="md">
          <Mantine.Table.ScrollContainer minWidth={980}>
            <Mantine.Table withColumnBorders highlightOnHover>
              <Mantine.Table.Thead>
                <Mantine.Table.Tr>
                  <Mantine.Table.Th rowSpan={2}>Estudiante</Mantine.Table.Th>
                  {scoresMock.periods.map((period) => (
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
                  {periodColumns.map((column) => (
                    <Mantine.Table.Th key={column.key} ta="center">
                      {column.label}
                    </Mantine.Table.Th>
                  ))}
                </Mantine.Table.Tr>
              </Mantine.Table.Thead>

              <Mantine.Table.Tbody>
                {students.map((student) => (
                  <Mantine.Table.Tr key={student.id}>
                    <Mantine.Table.Td fw={600}>{student.name}</Mantine.Table.Td>
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
                            value={student.grades[column.key] ?? 0}
                            hideControls
                            min={0}
                            max={5}
                            clampBehavior="strict"
                            h="100%"
                            w="100%"
                            step={0.1}
                            decimalScale={2}
                            fixedDecimalScale
                            styles={{
                              input: { textAlign: "center" },
                            }}
                            onChange={(value) =>
                              handleGradeChange(student.id, column.key, value)
                            }
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
                            getPeriodFinal(student.grades, column.periodId),
                          )}
                        </Mantine.Table.Td>
                      ),
                    )}
                    <Mantine.Table.Td ta="center" fw={600}>
                      {toFixed(getStudentAverage(student.grades))}
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
      </Fragment>
    );
  };

  return renderComponent();
}
