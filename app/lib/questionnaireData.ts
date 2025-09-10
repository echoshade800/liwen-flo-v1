import { Question, QuestionnaireAnswers } from './types';

export function getQuestions(): Question[] {
  return [
    {
      id: 'q_birth_year',
      type: 'number_picker',
      title: 'What year were you born?',
      body: 'This helps us provide age-appropriate health insights.',
      min: 1950,
      max: new Date().getFullYear() - 13,
      defaultValue: 1995,
      unit: '',
      reassurance: {
        title: 'Privacy First',
        content: 'Your personal information is encrypted and never shared with third parties.'
      }
    },
    {
      id: 'q_cycle_length',
      type: 'number_picker',
      title: 'How long is your typical cycle?',
      body: 'Count from the first day of one period to the first day of the next.',
      min: 21,
      max: 45,
      defaultValue: 28,
      unit: 'days',
      reassurance: {
        title: 'Normal Range',
        content: 'Cycles between 21-35 days are considered normal. Everyone is different!'
      }
    },
    {
      id: 'q_avg_period',
      type: 'number_picker',
      title: 'How long does your period usually last?',
      body: 'Count the days from start to finish of your menstrual flow.',
      min: 2,
      max: 10,
      defaultValue: 5,
      unit: 'days',
      reassurance: {
        title: 'Typical Duration',
        content: 'Most periods last 3-7 days. Variations are completely normal.'
      }
    },
    {
      id: 'q_period_dates',
      type: 'period_dates',
      title: 'When did your last period start?',
      body: 'Select the dates to help us predict your next cycle.',
      reassurance: {
        title: 'Better Predictions',
        content: 'Historical data helps us provide more accurate cycle predictions.'
      }
    },
    {
      id: 'q_goals',
      type: 'multiple_choice',
      title: 'What are your main goals?',
      body: 'Select all that apply to personalize your experience.',
      options: [
        { id: 'track_cycle', label: 'Track my cycle', kind: 'secondary' },
        { id: 'predict_period', label: 'Predict my period', kind: 'secondary' },
        { id: 'understand_body', label: 'Understand my body better', kind: 'secondary' },
        { id: 'plan_activities', label: 'Plan activities around my cycle', kind: 'secondary' },
        { id: 'health_insights', label: 'Get health insights', kind: 'secondary' }
      ]
    },
    {
      id: 'q_symptoms',
      type: 'multiple_choice',
      title: 'Which symptoms do you typically experience?',
      body: 'This helps us provide relevant tracking options.',
      options: [
        { id: 'cramps', label: 'Cramps', kind: 'secondary' },
        { id: 'mood_changes', label: 'Mood changes', kind: 'secondary' },
        { id: 'bloating', label: 'Bloating', kind: 'secondary' },
        { id: 'headaches', label: 'Headaches', kind: 'secondary' },
        { id: 'fatigue', label: 'Fatigue', kind: 'secondary' },
        { id: 'none', label: 'None of the above', kind: 'secondary' }
      ]
    }
  ];
}