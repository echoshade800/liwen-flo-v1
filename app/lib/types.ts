// 用户相关类型
export interface User {
  id: string;
  email: string;
  birthYear: number;
  cycleLength: number;
  periodLength: number;
  lastPeriodDate?: string;
  createdAt: string;
  updatedAt: string;
}

// 周期相关类型
export interface Cycle {
  id: string;
  userId: string;
  startDate: string;
  endDate?: string;
  length: number;
  periodLength: number;
  phase: CyclePhase;
  createdAt: string;
  updatedAt: string;
}

// 周期阶段
export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

// 症状相关类型
export interface Symptom {
  id: string;
  name: string;
  category: SymptomCategory;
  severity?: number;
  date: string;
  userId: string;
}

export type SymptomCategory = 'physical' | 'emotional' | 'behavioral';

// 心情相关类型
export interface Mood {
  id: string;
  userId: string;
  date: string;
  mood: MoodType;
  intensity: number;
  notes?: string;
}

export type MoodType = 'happy' | 'sad' | 'anxious' | 'irritable' | 'calm' | 'energetic' | 'tired';

// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 表单相关类型
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  birthYear: number;
}

// 通知相关类型
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  scheduledDate: string;
  isRead: boolean;
  createdAt: string;
}

export type NotificationType = 'period_reminder' | 'ovulation_reminder' | 'cycle_insight' | 'health_tip';

// 目标相关类型
export interface Goal {
  id: string;
  userId: string;
  type: GoalType;
  description: string;
  targetDate?: string;
  isCompleted: boolean;
  createdAt: string;
}

export type GoalType = 'track_cycle' | 'understand_symptoms' | 'improve_health' | 'family_planning';