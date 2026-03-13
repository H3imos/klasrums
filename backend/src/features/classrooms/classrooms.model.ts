export interface ClassroomModel {
  id: string;
  name: string;
  room: string;
  status: "active" | "archived";
  studentsCount: number;
  periodsCount: number;
  activitiesCount: number;
  createdAt: string;
  updatedAt: string;
}
