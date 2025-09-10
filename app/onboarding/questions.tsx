import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform, StatusBar } from 'react-native';
import { router } from 'expo-router';
import dayjs from 'dayjs';
import { useCycleStore } from '../store/useCycleStore';
import { colors, radii, spacing, typography } from '../theme/tokens';
import { QUESTIONNAIRE_DATA } from '../lib/questionnaire';
import QuestionCard from '../components/QuestionCard';

export default function OnboardingQuestionsScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  const setProfile = useCycleStore(state => state.setProfile);
  const setPreferences = useCycleStore(state => state.setPreferences);
  const setPeriodLogs = useCycleStore(state => state.setPeriodLogs);

  const currentQuestion = QUESTIONNAIRE_DATA[currentIndex];
  
  const handleAnswer = (answer: any) => {
    console.log('=== Questions handleAnswer ===');
    console.log('问题ID:', currentQuestion.id);
    console.log('收到的答案:', answer, '类型:', typeof answer, '是否数组:', Array.isArray(answer));
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
    
    console.log('Questions 页面 answers 状态已更新:', {
      ...answers,
      [currentQuestion.id]: answer
    });
  };

  // 为数字题设置默认值
  useEffect(() => {
    if (currentQuestion.type === 'number' && !answers[currentQuestion.id]) {
      let defaultValue;
      if (currentQuestion.id === 'q_avg_cycle') {
        defaultValue = 28;
      } else if (currentQuestion.id === 'q_avg_period') {
        defaultValue = 6;
      } else {
        defaultValue = currentQuestion.default;
      }
      
      if (defaultValue !== undefined) {
        setAnswers(prev => ({
          ...prev,
          [currentQuestion.id]: defaultValue
        }));
      }
    }
  }, [currentQuestion.id, currentQuestion.type, currentQuestion.default, answers]);

  const handleNext = () => {
    if (currentIndex < QUESTIONNAIRE_DATA.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Save all answers and complete onboarding
      saveAnswersAndComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const saveAnswersAndComplete = () => {
    // Extract key data for preferences
    console.log('=== Questions saveAnswersAndComplete ===');
    console.log('所有问卷答案:', answers);
    
    const periodDates = answers.q_period_dates;
    console.log('提取的经期日期:', periodDates);
    console.log('日期数据详情:', {
      type: typeof periodDates,
      isArray: Array.isArray(periodDates),
      length: Array.isArray(periodDates) ? periodDates.length : 'N/A',
      content: periodDates
    });
    
    const avgCycle = answers.q_avg_cycle || 28;
    const avgPeriod = answers.q_avg_period || 5;
    
    const height = answers.q_height_cm;
    
    // Check if user selected period dates to determine next route
    const hasSelectedPeriodDates = periodDates && Array.isArray(periodDates) && periodDates.length > 0;
    console.log('是否有有效的经期日期选择:', hasSelectedPeriodDates);
    
    if (hasSelectedPeriodDates) {
      // Calculate predicted next period date
      const sortedDates = [...periodDates].sort();
      const lastPeriodStart = sortedDates[0]; // Earliest date as LMP
      console.log('排序后的日期:', sortedDates);
      console.log('设定 LMP 为:', lastPeriodStart);
      
      const predictedDate = dayjs(lastPeriodStart).add(avgCycle, 'day').format('YYYY-MM-DD');
      console.log('预测下次经期:', predictedDate);
      
      // Save period dates to periodLogs and set LMP
      console.log('=== 开始保存数据到 Store ===');
      console.log('调用 setPeriodLogs，传入日期数组:', periodDates);
      setPeriodLogs(periodDates);
      
      setPreferences({
        lastMenstrualPeriod: lastPeriodStart,
        avgCycle,
        avgPeriod,
      });
      console.log('偏好设置已保存');
      
      // 验证保存结果
      const currentState = useCycleStore.getState();
      console.log('Store 验证 - periodLogs:', currentState.periodLogs);
      console.log('Store 验证 - LMP:', currentState.preferences.lastMenstrualPeriod);
      
      // Save all questionnaire answers to profile
      setProfile({
        questionnaireAnswers: answers,
        height,
      });
      
      console.log('导航到预测页面，参数:', predictedDate);
      
      // Navigate to prediction page with calculated date
      router.push({
        pathname: '/onboarding/period-prediction',
        params: { predictedDate }
      });
      return;
    }
    
    // If no period dates selected, save preferences without LMP
    console.log('未选择经期日期，保存基本设置');
    setPreferences({
      avgCycle,
      avgPeriod,
    });

    // Save all questionnaire answers to profile
    setProfile({
      questionnaireAnswers: answers,
      height,
    });

    // Navigate directly to done page
    console.log('直接导航到完成页面');
    router.push('/onboarding/done');
  };

  const canContinue = () => {
    const answer = answers[currentQuestion.id];
    
    // Info pages can always continue
    if (currentQuestion.type === 'info') {
      return true;
    }
    
    if (currentQuestion.required && !answer) {
      return false;
    }

    // For other types, check if answered
    return answer !== undefined && answer !== null && answer !== '';
  };

  const getProgressPercentage = () => {
    return ((currentIndex + 1) / QUESTIONNAIRE_DATA.length) * 100;
  };

  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }]}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progress, 
                { width: `${getProgressPercentage()}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {QUESTIONNAIRE_DATA.length}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <QuestionCard
          question={currentQuestion}
          answer={answers[currentQuestion.id]}
          onAnswer={handleAnswer}
          onNext={handleNext}
        />
      </ScrollView>

      <View style={styles.navigation}>
        {currentIndex > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={handlePrevious}>
            <Text style={styles.backButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[
            styles.nextButton, 
            !canContinue() && styles.buttonDisabled,
            currentIndex === 0 && styles.nextButtonFull
          ]} 
          onPress={handleNext}
          disabled={!canContinue()}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === QUESTIONNAIRE_DATA.length - 1 ? 'Complete' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
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
  progress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    ...typography.small,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing(3),
  },
  navigation: {
    flexDirection: 'row',
    paddingHorizontal: spacing(3),
    paddingBottom: spacing(3),
    gap: spacing(2),
  },
  backButton: {
    flex: 1,
    backgroundColor: colors.gray100,
    borderRadius: radii.card,
    paddingVertical: spacing(2),
    alignItems: 'center',
  },
  backButtonText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  nextButton: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: radii.card,
    paddingVertical: spacing(2),
    alignItems: 'center',
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: colors.gray300,
  },
});