export type UserRole = 'MANAGER' | 'EMPLOYEE';
export type ObjectiveType = 'PERSONAL' | 'TEAM';

export interface User {
  id: number;
  name: string;
  role: UserRole;
  email: string;
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

export interface MemberReportEntry {
  user: User;
  totalObjectives: number;
  submittedObjectives: number;
  gradedObjectives: number;
  totalKrs: number;
  reportedKrs: number;
  avgSelfReportPercent: number | null;
  avgProgress: number;
  objectives: Objective[];
}

export interface SubsidiariesData {
  myDraftCount: number;
  myDraftObjectives: { id: number; title: string; krCount: number }[];
  myKrsWithoutSelfReport: { objectiveId: number; objectiveTitle: string; krId: number; krTitle: string }[];
  mySelfReportPendingCount: number;
  isManager: boolean;
  totalTeamMembers: number;
  membersFullySubmitted: number;
  membersNotSubmitted: { memberId: number; memberName: string; totalObjectives: number; submittedObjectives: number }[];
  membersPendingReview: { memberId: number; memberName: string; objectiveId: number; objectiveTitle: string }[];
  objectivesPendingGrade: number;
  objectivesGraded: number;
}
