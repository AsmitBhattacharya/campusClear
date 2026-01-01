
export enum RecruitmentType {
  INTERNSHIP = 'Internship',
  FULL_TIME = 'Full-time'
}

export enum ApplicationStatus {
  VISITING_SOON = 'Visiting Soon',
  ONGOING = 'Ongoing',
  COMPLETED = 'Completed'
}

export interface InterviewStory {
  id: string;
  studentName: string;
  branch: string;
  year: number;
  content: string;
  rating: number;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  role: string;
  type: RecruitmentType;
  deadline: string;
  status: ApplicationStatus;
  minCGPA: number;
  eligibleBranches: string[];
  description: string;
  interviewStories: InterviewStory[];
}

export type StreakStatus = 'done' | 'missed' | 'pending';

export interface PlatformStreak {
  name: string;
  currentStreak: number;
  totalSolved: number;
  activity: StreakStatus[]; // 7 days of the week
}

export interface UserProfile {
  name: string;
  email: string;
  cgpa: number;
  branch: string;
  graduationYear: number;
  skills: string[];
  savedCompanies: string[];
  appliedCompanies: string[];
  streaks: {
    leetcode: PlatformStreak;
    codeforces: PlatformStreak;
    gfg: PlatformStreak;
  };
}

export type View = 'AUTH' | 'ONBOARDING' | 'HOME' | 'DETAILS' | 'PROFILE' | 'ADD_COMPANY' | 'LIVE_COACH' | 'JOB_AGENT' | 'ANALYTICS' | 'FLASH_PREP';
