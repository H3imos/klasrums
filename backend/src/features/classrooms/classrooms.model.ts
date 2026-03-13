export interface ClassroomModel {
  id: string;
  name: string;
  room: string;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
}
