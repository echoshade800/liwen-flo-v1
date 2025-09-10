export type QuestionType = 'single' | 'multi' | 'date' | 'number' | 'info';

export interface QAAction {
  id: string;
  label: string;
  kind?: 'primary' | 'secondary';
}

export interface InfoItem {
  id: string;
  type: 'info';
  title: string;
  body?: string;
  image?: any;
  actions?: QAAction[];
}

export interface QuestionOption {
  id: string;
  label: string;
  emoji?: string;
}

export interface BaseQuestion {
  id: string;
  title: string;
  subtitle?: string;
  required?: boolean;
}

export interface SingleQuestion extends BaseQuestion {
  type: 'single';
  options: QuestionOption[];
  reassurance?: Record<string, string>;
}

export interface MultiQuestion extends BaseQuestion {
  type: 'multi';
  options: QuestionOption[];
  reassurance?: Record<string, string>;
}

export interface DateQuestion extends BaseQuestion {
  type: 'date';
}

export interface NumberQuestion extends BaseQuestion {
  type: 'number';
  default?: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface PeriodDatesQuestion extends BaseQuestion {
  type: 'period_dates';
}

export type Question = SingleQuestion | MultiQuestion | DateQuestion | NumberQuestion | PeriodDatesQuestion;
export type QuestionnaireItem = InfoItem | Question;