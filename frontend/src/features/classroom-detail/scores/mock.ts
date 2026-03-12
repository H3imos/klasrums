export type ScoreActivity = {
  id: string;
  label: string;
  weight: number;
};

export type ScorePeriod = {
  id: string;
  label: string;
  activities: ScoreActivity[];
};

export type StudentScores = {
  id: string;
  name: string;
  grades: Record<string, number>;
};

export type ScoresMock = {
  periods: ScorePeriod[];
  students: StudentScores[];
};

export const scoresMock: ScoresMock = {
  periods: [
    {
      id: "period-1",
      label: "Periodo 1",
      activities: [
        { id: "a1", label: "A1", weight: 0.25 },
        { id: "a2", label: "A2", weight: 0.25 },
        { id: "a3", label: "A3", weight: 0.25 },
        { id: "a4", label: "A4", weight: 0.25 },
      ],
    },
    {
      id: "period-2",
      label: "Periodo 2",
      activities: [
        { id: "a5", label: "A1", weight: 0.3 },
        { id: "a6", label: "A2", weight: 0.3 },
        { id: "a7", label: "A3", weight: 0.4 },
      ],
    },
  ],
  students: [
    {
      id: "st-1",
      name: "Ana Gomez",
      grades: { a1: 4.5, a2: 4.2, a3: 3.8, a4: 4.7, a5: 4.4, a6: 3.9, a7: 4.8 },
    },
    {
      id: "st-2",
      name: "Carlos Ruiz",
      grades: { a1: 3.8, a2: 4.0, a3: 4.1, a4: 3.5, a5: 4.2, a6: 4.6, a7: 4.0 },
    },
    {
      id: "st-3",
      name: "Diana Lopez",
      grades: { a1: 4.9, a2: 4.6, a3: 4.4, a4: 4.8, a5: 4.5, a6: 4.7, a7: 4.9 },
    },
    {
      id: "st-4",
      name: "Mateo Perez",
      grades: { a1: 3.6, a2: 3.9, a3: 4.0, a4: 3.7, a5: 3.8, a6: 4.1, a7: 4.3 },
    },
  ],
};
