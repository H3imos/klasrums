import type {
  ClassroomApiDto,
  CreateClassroomPayload,
  UpdateClassroomPayload
} from "./types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

const buildUrl = (path: string) => `${API_BASE_URL}${path}`;

const parseErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message ?? "Unexpected error";
  } catch {
    return "Unexpected error";
  }
};

const requestJson = async <T>(
  path: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(buildUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return (await response.json()) as T;
};

const requestVoid = async (path: string, options?: RequestInit): Promise<void> => {
  const response = await fetch(buildUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
};

export const listClassrooms = async (): Promise<ClassroomApiDto[]> =>
  requestJson<ClassroomApiDto[]>("/classrooms");

export const createClassroom = async (
  payload: CreateClassroomPayload
): Promise<ClassroomApiDto> =>
  requestJson<ClassroomApiDto>("/classrooms", {
    method: "POST",
    body: JSON.stringify(payload)
  });

export const updateClassroom = async (
  id: string,
  payload: UpdateClassroomPayload
): Promise<ClassroomApiDto> =>
  requestJson<ClassroomApiDto>(`/classrooms/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });

export const deleteClassroom = async (id: string): Promise<void> =>
  requestVoid(`/classrooms/${id}`, { method: "DELETE" });
