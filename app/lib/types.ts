// Type definitions for the period tracking app

export interface PeriodEntry {
  startDate: string;
  endDate?: string;
}

export interface DailyLog {
  date: string;
  feeling?: string[];
  flow?: 'light' | 'medium' | 'heavy' | 'clots' | 'none';
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

export interface CycleInfo {
  currentCycleDay: number;
  nextPeriodDate: string;
  ovulationDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  cycleLengthStatus: 'green' | 'yellow' | 'red';
  periodLengthStatus: 'green' | 'yellow' | 'red';
}

export interface InfoItem {
  id: string;
  type: 'info';
  smallTitle?: string;
  title: string;
  body?: string;
  image?: any;
  actions?: { id: string; label: string; kind?: 'primary' | 'secondary' }[];
}

export interface QuestionItem {
  id: string;
  type: 'single' | 'multiple' | 'date' | 'number';
  title: string;
  body?: string;
  options?: { id: string; label: string }[];
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  default?: any;
}

export type QuestionnaireItem = InfoItem | QuestionItem;