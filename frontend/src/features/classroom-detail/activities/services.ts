import type {
  ActivityApiDto,
  CreateActivityPayload,
  CreatePeriodPayload,
  PeriodApiDto,
  UpdatePeriodPayload,
  UpdateActivityPayload,
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
  options?: RequestInit,
): Promise<T> => {
  const response = await fetch(buildUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return (await response.json()) as T;
};

const requestVoid = async (
  path: string,
  options?: RequestInit,
): Promise<void> => {
  const response = await fetch(buildUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
};

export const listPeriods = async (
  classroomId: string,
): Promise<PeriodApiDto[]> =>
  requestJson<PeriodApiDto[]>(`/classrooms/${classroomId}/periods`);

export const createPeriod = async (
  classroomId: string,
  payload: CreatePeriodPayload,
): Promise<PeriodApiDto> =>
  requestJson<PeriodApiDto>(`/classrooms/${classroomId}/periods`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const deletePeriod = async (
  classroomId: string,
  periodId: string,
): Promise<void> =>
  requestVoid(`/classrooms/${classroomId}/periods/${periodId}`, {
    method: "DELETE",
  });

export const updatePeriod = async (
  classroomId: string,
  periodId: string,
  payload: UpdatePeriodPayload,
): Promise<PeriodApiDto> =>
  requestJson<PeriodApiDto>(`/classrooms/${classroomId}/periods/${periodId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const listActivities = async (
  classroomId: string,
): Promise<ActivityApiDto[]> =>
  requestJson<ActivityApiDto[]>(`/classrooms/${classroomId}/activities`);

export const createActivity = async (
  classroomId: string,
  payload: CreateActivityPayload,
): Promise<ActivityApiDto> =>
  requestJson<ActivityApiDto>(`/classrooms/${classroomId}/activities`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const deleteActivity = async (
  classroomId: string,
  activityId: string,
): Promise<void> =>
  requestVoid(`/classrooms/${classroomId}/activities/${activityId}`, {
    method: "DELETE",
  });

export const updateActivity = async (
  classroomId: string,
  activityId: string,
  payload: UpdateActivityPayload,
): Promise<ActivityApiDto> =>
  requestJson<ActivityApiDto>(
    `/classrooms/${classroomId}/activities/${activityId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
