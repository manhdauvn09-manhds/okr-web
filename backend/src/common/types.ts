export type UserRole = 'MANAGER' | 'EMPLOYEE';
export type ObjectiveType = 'PERSONAL' | 'TEAM';

export interface User {
  id: number;
  name: string;
  role: UserRole;
  email: string;
  password: string;
  managerId?: number;
}

export interface KeyResult {
  id: number;
  title: string;
  progress: number;
  startValue: number;
  targetValue: number;
  deadline: string;
  selfReportPercent?: number;
  selfReportedAt?: string;
}

export interface ObjectiveGrade {
  stars: number;
  comment: string;
  gradedAt: string;
  gradedBy: number;
  graderName: string;
}

export interface Objective {
  id: number;
  title: string;
  description: string;
  ownerId: number;
  ownerName: string;
  ownerRoleAtCreation: UserRole;
  quarter: string;
  type: ObjectiveType;
  isSubmitted: boolean;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
  keyResults: KeyResult[];
  grade?: ObjectiveGrade;
}
