import dayjs from 'dayjs';

export interface QuestionOption {
  id: string;
  text: string;
  emoji?: string;
}

export interface InfoItem {
  id: string;
  type: 'info';
  smallTitle?: string;
  title: string;
  body: string;
  required?: boolean;
}

export interface QuestionItem {
  id: string;
  type: 'single' | 'multiple' | 'date' | 'number' | 'text';
  title: string;
  subtitle?: string;
  options?: QuestionOption[];
  required?: boolean;
  default?: any;
  min?: number;
  max?: number;
  unit?: string;
  reassurance?: {
    title: string;
    content: string;
  };
}

export type QuestionnaireItem = InfoItem | QuestionItem;

export const QUESTIONNAIRE_DATA: QuestionnaireItem[] = [
  {
    id: 'q_period_feelings',
    type: 'multiple',
    title: 'How do you feel about your period?',
    subtitle: 'Select all that apply',
    options: [
      { id: 'normal', text: 'It\'s a normal part of life', emoji: '😌' },
      { id: 'inconvenient', text: 'It\'s inconvenient', emoji: '😕' },
      { id: 'painful', text: 'It\'s painful', emoji: '😣' },
      { id: 'embarrassing', text: 'It\'s embarrassing', emoji: '😳' },
      { id: 'empowering', text: 'It makes me feel connected to my body', emoji: '💪' },
    ],
    required: false,
    reassurance: {
      title: 'You\'re not alone',
      content: 'Many people experience mixed feelings about their period. Understanding your cycle can help you feel more in control.'
    }
  },
  {
    id: 'cycle_phases_info',
    type: 'info',
    smallTitle: 'Next, let\'s learn about your cycle.',
    title: 'Each of your cycles includes four phases: menstruation, follicular phase, ovulation, and luteal phase.',
    body: 'Your hormone levels vary in each phase. Flo will use your period logs to assess hormonal changes and provide targeted guidance to help improve your quality of life.',
    required: false,
  },
  {
    id: 'q_lmp',
    type: 'date',
    title: 'When did your last period start?',
    subtitle: 'This helps us make accurate predictions',
    required: true,
  },
  {
    id: 'q_avg_cycle',
    type: 'number',
    title: 'How long is your cycle usually?',
    subtitle: 'From the first day of one period to the first day of the next',
    min: 21,
    max: 45,
    default: 28,
    unit: 'days',
    required: true,
    reassurance: {
      title: 'Normal range',
      content: 'Most cycles are between 21-35 days. Don\'t worry if yours is different - everyone\'s body is unique!'
    }
  },
  {
    id: 'q_avg_period',
    type: 'number',
    title: 'How long does your period usually last?',
    subtitle: 'Number of days with bleeding',
    min: 2,
    max: 10,
    default: 5,
    unit: 'days',
    required: true,
    reassurance: {
      title: 'Perfectly normal',
      content: 'Period length typically ranges from 3-7 days. Tracking helps you understand your personal pattern.'
    }
  },
  {
    id: 'q_height_cm',
    type: 'number',
    title: 'What\'s your height?',
    subtitle: 'This helps us provide more personalized health insights',
    min: 120,
    max: 220,
    default: 165,
    unit: 'cm',
    required: false,
  },
  {
    id: 'q_exercise_frequency',
    type: 'single',
    title: 'How often do you exercise?',
    options: [
      { id: 'daily', text: 'Daily', emoji: '🏃‍♀️' },
      { id: 'few_times_week', text: 'A few times a week', emoji: '💪' },
      { id: 'weekly', text: 'Once a week', emoji: '🚶‍♀️' },
      { id: 'rarely', text: 'Rarely', emoji: '😴' },
      { id: 'never', text: 'Never', emoji: '🛋️' },
    ],
    required: false,
  },
  {
    id: 'q_stress_level',
    type: 'single',
    title: 'How would you describe your stress level?',
    options: [
      { id: 'low', text: 'Low - I feel relaxed most of the time', emoji: '😌' },
      { id: 'moderate', text: 'Moderate - Some stress but manageable', emoji: '😐' },
      { id: 'high', text: 'High - Often feeling overwhelmed', emoji: '😰' },
      { id: 'very_high', text: 'Very high - Constantly stressed', emoji: '🤯' },
    ],
    required: false,
    reassurance: {
      title: 'Stress affects cycles',
      content: 'High stress can impact your menstrual cycle. We\'ll help you track patterns and suggest stress management techniques.'
    }
  },
  {
    id: 'q_sleep_quality',
    type: 'single',
    title: 'How is your sleep quality?',
    options: [
      { id: 'excellent', text: 'Excellent - I sleep well every night', emoji: '😴' },
      { id: 'good', text: 'Good - Usually sleep well', emoji: '😊' },
      { id: 'fair', text: 'Fair - Sometimes have trouble sleeping', emoji: '😕' },
      { id: 'poor', text: 'Poor - Often have sleep issues', emoji: '😵' },
    ],
    required: false,
  },
];