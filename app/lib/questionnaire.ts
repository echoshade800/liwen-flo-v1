import { QuestionnaireItem } from './types';

export const QUESTIONNAIRE_DATA: QuestionnaireItem[] = [
  {
    id: 'q_feeling_about_period',
    type: 'single',
    title: 'How do you feel about your period?',
    options: [
      { id: 'mixed', label: 'Mixed feelings', emoji: '😕' },
      { id: 'embarrassed', label: 'Embarrassed', emoji: '😬' },
      { id: 'hate', label: 'Really hate it', emoji: '😡' },
      { id: 'curious', label: 'Want to learn more', emoji: '🤔' },
      { id: 'friends', label: 'We\'re already friends', emoji: '😌' }
    ],
    reassurance: {
      mixed: 'Many people have these complex feelings. Consistent tracking can help you see patterns and gradually become more comfortable.',
      embarrassed: 'Feeling a bit embarrassed about period topics is completely normal. Medical experts will provide reliable insights. In fact, many users say the app helps them talk more openly about their symptoms and feelings.',
      hate: 'You\'re not alone—many people feel the same way. You might not love your period, but we\'ll help you predict when it starts and manage physical symptoms.',
      curious: 'Many users say the app helped them learn more about their cycle health and gain related knowledge.',
      friends: 'We\'ll provide more accurate predictions of periods and symptoms, combined with professional insights to help you live in harmony with your cycle.'
    }
  },

  {
    id: 'cycle_phases_info',
    type: 'info',
    title: 'Each of your cycles includes four phases: menstruation, follicular phase, ovulation, and luteal phase.',
    body: 'Your hormone levels vary in each phase. Flo will use your period logs to assess hormonal changes and provide targeted guidance to help improve your quality of life.',
    actions: [
      { id: 'continue', label: 'Next', kind: 'primary' }
    ]
  },

  {
    id: 'q_is_regular',
    type: 'single',
    title: 'Are your periods regular?',
    subtitle: 'This means the number of days between each period is roughly the same.',
    options: [
      { id: 'yes', label: 'Yes', emoji: '✅' },
      { id: 'no', label: 'No', emoji: '❌' },
      { id: 'unsure', label: 'I\'m not sure', emoji: '🤔' }
    ],
    reassurance: {
      yes: 'Great! We\'ll tell you when your period is expected to start and what symptoms you might experience, helping you understand how your cycle affects daily life.',
      no: 'Period fluctuations aren\'t uncommon. Tracking can help identify patterns and triggers, and we\'ll highlight key changes for you.',
      unsure: 'That\'s okay. Start tracking 2-3 cycles from today and you\'ll see patterns more clearly.'
    }
  },

  {
    id: 'q_health_conditions',
    type: 'multi',
    title: 'Do you have any of these health concerns?',
    subtitle: 'Select all that apply.',
    options: [
      { id: 'candida', label: 'Yeast infection', emoji: '🦠' },
      { id: 'uti', label: 'UTI', emoji: '🚻' },
      { id: 'bv', label: 'Bacterial vaginosis (BV)', emoji: '🧫' },
      { id: 'pcos', label: 'PCOS', emoji: '🧬' },
      { id: 'endometriosis', label: 'Endometriosis', emoji: '🩸' },
      { id: 'fibroids', label: 'Fibroids', emoji: '🧩' },
      { id: 'unsure', label: 'I\'m not sure', emoji: '🤷' },
      { id: 'none', label: 'None of the above', emoji: '🙅‍♀️' }
    ]
  },

  {
    id: 'q_discharge_awareness',
    type: 'single',
    title: 'Do you know that your discharge changes throughout your cycle?',
    options: [
      { id: 'yes', label: 'Yes', emoji: '✅' },
      { id: 'no', label: 'No', emoji: '❌' }
    ],
    reassurance: {
      yes: 'Great! Having discharge is completely normal. You can learn a lot about your reproductive health from its color, smell, and texture.',
      no: 'Having discharge is normal and it changes throughout your cycle. You can also get useful health information from its texture, color, and smell.'
    }
  },

  {
    id: 'q_today_symptoms',
    type: 'multi',
    title: 'Your menstrual cycle affects how you feel. How are you feeling today?',
    subtitle: 'Select your symptoms',
    options: [
      { id: 'cramps', label: 'Cramps', emoji: '🤕' },
      { id: 'fatigue', label: 'Fatigue', emoji: '😴' },
      { id: 'bloating', label: 'Bloating', emoji: '🎈' },
      { id: 'breast_tenderness', label: 'Breast tenderness', emoji: '🎯' },
      { id: 'back_pain', label: 'Back pain', emoji: '🦴' },
      { id: 'none', label: 'None of these', emoji: '🙅‍♀️' }
    ]
  },

  {
    id: 'q_cycle_related_symptoms',
    type: 'multi',
    title: 'Have you experienced any cycle-related symptoms?',
    options: [
      { id: 'cramps', label: 'Cramps', emoji: '🤕' },
      { id: 'spotting', label: 'Spotting', emoji: '🩸' },
      { id: 'bloating', label: 'Bloating', emoji: '🎈' },
      { id: 'mood_swings', label: 'Mood swings', emoji: '🎢' },
      { id: 'headache', label: 'Headache', emoji: '🤯' },
      { id: 'fatigue', label: 'Fatigue', emoji: '😴' },
      { id: 'breast_tenderness', label: 'Breast tenderness', emoji: '🎯' },
      { id: 'back_pain', label: 'Back pain', emoji: '🦴' }
    ],
    reassurance: {
      cramps: 'While period pain is common, it\'s important to distinguish between normal and concerning levels. Track intensity and timing to find patterns and causes, and use scientific methods for relief.',
      spotting: 'About 5% of women may experience light bleeding during ovulation; this needs to be assessed alongside other signs. Recording this helps determine when to seek medical advice.',
      bloating: 'Want to get rid of bloating? The first step is finding the cause. Track when it happens and see if it relates to cycle phases to get targeted relief suggestions.',
      mood_swings: 'Mood swings are as common as cramps or back pain. Track mood changes to see if there\'s a pattern and get expert advice on emotional management.',
      headache: 'Headaches before and after periods may be related to hormonal fluctuations. Tracking can help observe patterns and get relief suggestions.',
      fatigue: 'PMS and hormonal changes can cause cyclical fatigue. Track how you feel to better care for yourself.',
      breast_tenderness: 'Two-thirds of women experience breast tenderness during their cycle. Tracking helps understand the normal range and get suggestions for relieving discomfort.',
      back_pain: 'That\'s right, pain isn\'t just abdominal. Track back pain to help determine causes and find relief methods.'
    }
  },

  {
    id: 'q_sleep_impact',
    type: 'single',
    title: 'Does your cycle affect your sleep?',
    subtitle: 'Many users say the app improved their sleep quality.',
    options: [
      { id: 'yes', label: 'Yes', emoji: '✅' },
      { id: 'no', label: 'No', emoji: '❌' },
      { id: 'unsure', label: 'I\'m not sure', emoji: '🤔' }
    ],
    reassurance: {
      yes: 'Track your sleep to get rhythm and suggestions, learn what to do and avoid in each phase for sweet dreams.',
      no: 'It\'s great that you don\'t have cycle-related insomnia. If you want to further improve sleep quality, check out health experts\' suggestions and tips.',
      unsure: 'Sleep difficulties may be more common in certain cycle phases. Tracking sleep can help identify patterns and get rhythm suggestions.'
    }
  },

  {
    id: 'q_skin_impact',
    type: 'single',
    title: 'Does your cycle affect your skin?',
    subtitle: 'Many users say the app improved their skin condition.',
    options: [
      { id: 'yes', label: 'Yes', emoji: '✅' },
      { id: 'no', label: 'No', emoji: '❌' },
      { id: 'unsure', label: 'I\'m not sure', emoji: '🤔' }
    ],
    reassurance: {
      yes: 'Track breakouts and other issues to get skincare routine suggestions, learn about hormonal acne and other problems, and know which nutrients benefit your skin.',
      no: 'Great! You can also check dermatologists\' skincare routine suggestions for different skin types to maintain good condition.',
      unsure: 'Skin may fluctuate in different phases. Tracking and comparing with your cycle can help find triggers and suitable care solutions.'
    }
  },

  {
    id: 'q_energy_impact',
    type: 'single',
    title: 'Does your menstrual cycle affect your energy levels or activity intensity?',
    subtitle: 'This app is highly rated among health and fitness apps.',
    options: [
      { id: 'yes', label: 'Yes', emoji: '✅' },
      { id: 'no', label: 'No', emoji: '❌' },
      { id: 'unsure', label: 'I\'m not sure', emoji: '🤔' }
    ],
    reassurance: {
      yes: 'Hormone levels change with cycle phases, affecting your mental state, strength, endurance, and stamina. Check out optimal training plans customized for different phases.',
      no: 'Great! You can also refer to phase-specific training suggestions to maintain consistent output and safe loads.',
      unsure: 'Track your energy and activity intensity for a few weeks, compare with cycle phases to discover patterns and get corresponding training suggestions.'
    }
  },

  {
    id: 'q_diet_impact',
    type: 'single',
    title: 'Does your cycle affect your daily diet?',
    subtitle: 'Many users say their diet became healthier after using the app.',
    options: [
      { id: 'yes', label: 'Yes', emoji: '✅' },
      { id: 'no', label: 'No', emoji: '❌' },
      { id: 'unsure', label: 'I\'m not sure', emoji: '🤔' }
    ],
    reassurance: {
      yes: 'Want to know why you feel hungrier before your period or which foods can relieve PMS? Check out articles and videos from nutritionists and adjust your diet by cycle.',
      no: 'Great! You can find many healthy meal plans and get dietary suggestions to relieve PMS while enjoying food and saving money.',
      unsure: 'Want to better understand appetite changes before and after periods and suitable foods? Check nutritionist content and fine-tune your diet by cycle.'
    }
  },

  {
    id: 'q_mental_health_impact',
    type: 'multi',
    title: 'Has your cycle had any impact on your mental health?',
    options: [
      { id: 'mood_swings', label: 'Mood swings', emoji: '🎢' },
      { id: 'anxiety', label: 'Anxiety', emoji: '😟' },
      { id: 'fatigue', label: 'Fatigue', emoji: '😴' },
      { id: 'irritability', label: 'Irritability', emoji: '😠' },
      { id: 'low_mood', label: 'Low mood', emoji: '😞' },
      { id: 'pmdd', label: 'I have PMDD', emoji: '🩺' },
      { id: 'none', label: 'No, nothing comes to mind', emoji: '🙅‍♀️' }
    ],
    reassurance: {
      mood_swings: 'Mood swings, like cramps or back pain, are common cycle symptoms. By tracking mood changes, confirm if there\'s a pattern and get expert emotional management advice.',
      anxiety: 'Under the combined effects of brain chemistry and hormonal fluctuations, women are more prone to anxiety than men. The app provides professional insights from multiple health experts on anxiety management.',
      fatigue: 'Feeling extra tired may be more common in certain cycle phases. Track fatigue to determine connections and get treatment suggestions.',
      irritability: 'Hormonal fluctuations may affect emotional thresholds; for example, you may be more easily triggered during PMS. Track your feelings to see if you can find cycle-related patterns.',
      low_mood: 'While many factors can cause low mood, hormonal effects can be more significant than you imagine. Track your feelings to understand if they\'re cycle-related.',
      pmdd: 'PMDD is a more severe form of PMS, affecting about 5% of people. Please track symptoms and check the professional help and treatment information provided.',
      none: 'Great! Just track your symptoms and feelings to see if they\'re cycle-related.'
    }
  },

  // {
  //   id: 'q_lmp',
  //   type: 'date',
  //   title: 'Please select your last menstrual period (LMP) start date',
  //   required: true
  // },

  {
    id: 'q_avg_cycle',
    type: 'number',
    title: 'Your average cycle length (days)',
    default: 28,
    min: 15,
    max: 365
  },

  {
    id: 'q_avg_period',
    type: 'number',
    title: 'Your average period length (days)',
    default: 6,
    min: 3,
    max: 10
  }
];