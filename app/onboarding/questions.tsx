import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { useCycleStore } from '../store/useCycleStore';
import { colors, radii, spacing, typography } from '../theme/tokens';
import { getQuestions, Question, QuestionnaireAnswers } from '../lib/questionnaire';
import InfoCard from '../components/InfoCard';
import PeriodDateSelector from '../components/PeriodDateSelector';
import WheelNumberPicker from '../components/WheelNumberPicker';
import ReassuranceCard from '../components/ReassuranceCard';

export default function QuestionsScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({});
  const [selectedPeriodDates, setSelectedPeriodDates] = useState<string[]>([]);
  
  const setProfile = useCycleStore(state => state.setProfile);
  const setPreferences = useCycleStore(state => state.setPreferences);
  
  const questions = getQuestions();
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Save all answers and navigate to next screen
      setProfile({ questionnaireAnswers: answers });
      
      // Save period dates if any were selected
      if (selectedPeriodDates.length > 0) {
        const sortedDates = [...selectedPeriodDates].sort();
        const lastMenstrualPeriod = sortedDates[sortedDates.length - 1]; // Most recent date
        
        setPreferences({ lastMenstrualPeriod });
        // Note: periodLogs will be set by the store when it processes the LMP
      }
      
      router.push('/onboarding/health-notifications');
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePeriodDatesChange = (dates: string[]) => {
    setSelectedPeriodDates(dates);
    // Also save to answers for consistency
    handleAnswer(currentQuestion.id, dates);
  };

  const handleSkipPeriodDates = () => {
    // Skip period date selection and go to next question
    setSelectedPeriodDates([]);
    handleAnswer(currentQuestion.id, []);
    handleNext();
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    // Handle period dates question specially
    if (currentQuestion.type === 'period_dates') {
      return (
        <PeriodDateSelector
          selectedDates={selectedPeriodDates}
          onDatesChange={handlePeriodDatesChange}
          onSkip={handleSkipPeriodDates}
        />
      );
    }

    // Handle number picker questions
    if (currentQuestion.type === 'number_picker') {
      const currentValue = answers[currentQuestion.id] || currentQuestion.defaultValue || 28;
      
      return (
        <View style={styles.questionContainer}>
          <InfoCard
            title={currentQuestion.title}
            body={currentQuestion.body}
            onNext={handleNext}
          />
          
          <View style={styles.pickerContainer}>
            <WheelNumberPicker
              value={currentValue}
              onChange={(value) => handleAnswer(currentQuestion.id, value)}
              min={currentQuestion.min || 1}
              max={currentQuestion.max || 100}
              step={currentQuestion.step || 1}
              unit={currentQuestion.unit || 'days'}
            />
          </View>
          
          {currentQuestion.reassurance && (
            <ReassuranceCard
              title={currentQuestion.reassurance.title}
              content={currentQuestion.reassurance.content}
            />
          )}
        </View>
      );
    }

    // Handle regular multiple choice questions
    return (
      <View style={styles.questionContainer}>
        <InfoCard
          title={currentQuestion.title}
          body={currentQuestion.body}
          actions={currentQuestion.options?.map(option => ({
            id: option.id,
            label: option.label,
            kind: option.kind || 'secondary'
          }))}
          onNext={handleNext}
          onActionPress={(optionId) => handleAnswer(currentQuestion.id, optionId)}
        />
        
        {currentQuestion.reassurance && (
          <ReassuranceCard
            title={currentQuestion.reassurance.title}
            content={currentQuestion.reassurance.content}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }]}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1} of {questions.length}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderQuestion()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: spacing(3),
    paddingTop: spacing(2),
    paddingBottom: spacing(1),
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.gray300,
    borderRadius: 2,
    marginBottom: spacing(1),
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing(3),
  },
  questionContainer: {
    paddingVertical: spacing(2),
  },
  pickerContainer: {
    alignItems: 'center',
    marginVertical: spacing(3),
  },
});