import * as Mantine from "@mantine/core";
import { MiniCalendar } from "@mantine/dates";
import { X, Check, Clock3 } from "lucide-react";
import { useState } from "react";

import { type AttendanceStatus, attendanceStudentsMock } from "./mock";

export default function AttendancesView() {
  const [selectedDate, setSelectedDate] = useState<string>("2026-03-12");
  const [attendanceByDate, setAttendanceByDate] = useState<
    Record<string, Record<string, AttendanceStatus>>
  >({
    "2026-03-12": {
      "st-1": "present",
      "st-2": "late",
      "st-3": "present",
      "st-4": "absent",
    },
  });

  const attendanceForSelectedDate = attendanceByDate[selectedDate] ?? {};

  const setAttendanceStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceByDate((current) => ({
      ...current,
      [selectedDate]: {
        ...(current[selectedDate] ?? {}),
        [studentId]: status,
      },
    }));
  };

  return (
    <Mantine.Stack>
      <Mantine.Group justify="space-between" align="end" mb="sm">
        <Mantine.Box>
          <Mantine.Title order={3}>Asistencias</Mantine.Title>
          <Mantine.Text c="dimmed">
            Selecciona la fecha y marca el estado de asistencia.
          </Mantine.Text>
        </Mantine.Box>
      </Mantine.Group>

      <Mantine.Paper p="sm">
        <MiniCalendar
          value={selectedDate}
          onChange={setSelectedDate}
          numberOfDays={25}
        />
      </Mantine.Paper>

      <Mantine.Stack gap="sm">
        {attendanceStudentsMock.map((student) => {
          const status = attendanceForSelectedDate[student.id];

          return (
            <Mantine.Paper key={student.id} withBorder p="md">
              <Mantine.Group
                justify="space-between"
                align="center"
                wrap="nowrap"
              >
                <Mantine.Group wrap="nowrap">
                  <Mantine.Avatar
                    color="initials"
                    radius="xl"
                    name={student.fullName}
                  />

                  <Mantine.Box>
                    <Mantine.Text fw={600}>{student.fullName}</Mantine.Text>
                    <Mantine.Text size="sm" c="dimmed">
                      {student.email}
                    </Mantine.Text>
                  </Mantine.Box>
                </Mantine.Group>

                <Mantine.Group>
                  <Mantine.Tooltip label="Asistio">
                    <Mantine.ActionIcon
                      size="lg"
                      variant="light"
                      color={status === "present" ? "green" : "gray.6"}
                      onClick={() => setAttendanceStatus(student.id, "present")}
                      aria-label="Asistio"
                    >
                      <Check size={16} />
                    </Mantine.ActionIcon>
                  </Mantine.Tooltip>

                  <Mantine.Tooltip label="No asistio">
                    <Mantine.ActionIcon
                      size="lg"
                      variant="light"
                      color={status === "absent" ? "red" : "gray.6"}
                      onClick={() => setAttendanceStatus(student.id, "absent")}
                      aria-label="No asistio"
                    >
                      <X size={16} />
                    </Mantine.ActionIcon>
                  </Mantine.Tooltip>

                  <Mantine.Tooltip label="Llego tarde">
                    <Mantine.ActionIcon
                      size="lg"
                      variant="light"
                      color={status === "late" ? "yellow" : "gray.6"}
                      onClick={() => setAttendanceStatus(student.id, "late")}
                      aria-label="Llego tarde"
                    >
                      <Clock3 size={16} />
                    </Mantine.ActionIcon>
                  </Mantine.Tooltip>
                </Mantine.Group>
              </Mantine.Group>
            </Mantine.Paper>
          );
        })}
      </Mantine.Stack>
    </Mantine.Stack>
  );
}
