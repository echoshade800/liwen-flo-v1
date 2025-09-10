// 类型定义文件
export interface PeriodEntry {
  startDate: string;
  endDate?: string;
}

export interface CycleSummary {
  cycleLength: number;
  periodLength: number;
  status: 'green' | 'yellow' | 'red';
}

export interface DailyLog {
  date: string;
  feeling?: string[];
  flow?: 'light' | 'medium' | 'heavy' | 'clots';
  sexActivity?: 'none' | 'protected' | 'unprotected';
  libido?: 'low' | 'medium' | 'high';
  mood?: string[];
  symptoms?: string[];
  discharge?: 'dry' | 'watery' | 'eggwhite' | 'thick' | 'abnormal';
  digestion?: 'normal' | 'bloat' | 'diarrhea' | 'constipation';
  pregnancyTest?: 'not_tested' | 'negative' | 'positive';
  steps?: number;
  distanceKm?: number;
  sleepHours?: number;
  sleepQuality?: 'good' | 'ok' | 'poor';
  intakeWaterCups?: number;
  intakeWaterLiters?: number;
  medication?: string[];
  customTags?: string[];
}

export interface Preferences {
  avgCycle: number;
  avgPeriod: number;
  reminders?: boolean;
  healthSync?: boolean;
  lastMenstrualPeriod?: string;
}

export interface UserProfile {
  age?: number;
  birthYear?: number;
  goal?: string;
  hasCompletedOnboarding: boolean;
  questionnaireAnswers?: Record<string, any>;
  height?: number;
}