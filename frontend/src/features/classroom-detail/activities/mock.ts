export type Activity = {
  id: string;
  name: string;
  weight: number;
  dueDate: string;
  status: "Abierta" | "Cerrada";
};

export type Period = {
  id: string;
  name: string;
  dateStart: string;
  dateEnd: string;
  activities: Activity[];
};

export const periodsMock: Period[] = [
  {
    id: "p1",
    name: "Periodo 1",
    dateStart: "2026-03-01",
    dateEnd: "2026-04-10",
    activities: [
      {
        id: "a1",
        name: "Quiz de fracciones",
        dueDate: "2026-03-20",
        weight: 20,
        status: "Abierta",
      },
      {
        id: "a2",
        name: "Taller de algebra",
        dueDate: "2026-03-25",
        weight: 30,
        status: "Cerrada",
      },
      {
        id: "a3",
        name: "Exposicion de geometria",
        dueDate: "2026-04-05",
        weight: 25,
        status: "Abierta",
      },
      {
        id: "a4",
        name: "Evaluacion de estadistica",
        dueDate: "2026-04-10",
        weight: 25,
        status: "Abierta",
      },
    ],
  },
  {
    id: "p2",
    name: "Periodo 2",
    dateStart: "2026-04-11",
    dateEnd: "2026-05-20",
    activities: [
      {
        id: "a3",
        name: "Exposicion de geometria",
        dueDate: "2026-04-05",
        weight: 25,
        status: "Abierta",
      },
      {
        id: "a4",
        name: "Evaluacion de estadistica",
        dueDate: "2026-04-10",
        weight: 25,
        status: "Abierta",
      },
      {
        id: "a5",
        name: "Proyecto de matematicas",
        dueDate: "2026-04-20",
        weight: 50,
        status: "Cerrada",
      },
    ],
  },
];
