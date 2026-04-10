import { MemberReportEntry, Objective, User } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

async function request<T>(
  path: string,
  userId: number | null,
  options?: RequestInit,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> | undefined),
  };
  if (userId !== null) headers['x-user-id'] = String(userId);

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function getUsers() {
  return request<{ users: User[] }>('/auth/users', null, { method: 'GET' });
}

export async function login(email: string, password: string) {
  return request<{ user: User }>('/auth/login', null, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getObjectives(userId: number) {
  return request<{ objectives: Objective[] }>('/objectives', userId, { method: 'GET' });
}

export async function getMemberObjectives(userId: number) {
  return request<{ objectives: Objective[] }>('/members/objectives', userId, { method: 'GET' });
}

export async function getMemberReport(userId: number) {
  return request<{ report: MemberReportEntry[] }>('/members/report', userId, { method: 'GET' });
}

export async function createObjective(
  userId: number,
  payload: { title: string; description: string; quarter: string; type: 'PERSONAL' | 'TEAM' },
) {
  return request<{ objective: Objective }>('/objectives', userId, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function addKeyResult(
  userId: number,
  objectiveId: number,
  payload: { title: string; startValue: number; targetValue: number; deadline: string },
) {
  return request<{ objective: Objective }>(`/objectives/${objectiveId}/key-results`, userId, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function deleteKeyResult(userId: number, objectiveId: number, krId: number) {
  return request<{ objective: Objective }>(`/objectives/${objectiveId}/key-results/${krId}`, userId, {
    method: 'DELETE',
  });
}

export async function submitObjective(userId: number, objectiveId: number) {
  return request<{ objective: Objective }>(`/objectives/${objectiveId}/submit`, userId, {
    method: 'POST',
  });
}

export async function updateKrProgress(userId: number, objectiveId: number, krId: number, progress: number) {
  return request<{ objective: Objective }>(
    `/objectives/${objectiveId}/key-results/${krId}/progress`, userId,
    { method: 'PATCH', body: JSON.stringify({ progress }) },
  );
}

export async function selfReportKr(userId: number, objectiveId: number, krId: number, percent: number) {
  return request<{ objective: Objective }>(
    `/objectives/${objectiveId}/key-results/${krId}/self-report`, userId,
    { method: 'PATCH', body: JSON.stringify({ percent }) },
  );
}

export async function gradeObjective(userId: number, objectiveId: number, stars: number, comment: string) {
  return request<{ objective: Objective }>(`/objectives/${objectiveId}/grade`, userId, {
    method: 'POST',
    body: JSON.stringify({ stars, comment }),
  });
}
