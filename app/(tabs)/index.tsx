import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import dayjs from 'dayjs';
import { useCycleStore } from '../store/useCycleStore';
import { getCalendarData, calculateCurrentCycle, getNextPeriodPrediction } from '../lib/cycle';
import { notificationManager } from '../lib/notificationManager';
import { colors, spacing, typography, radii } from '../theme/tokens';
import MonthCalendar from '../components/MonthCalendar';
import DayInfoCard from '../components/DayInfoCard';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY-MM'));
  const [isLoading, setIsLoading] = useState(true);
  
  const periods = useCycleStore(state => state.periods);
  const dailyLogs = useCycleStore(state => state.dailyLogs);
  const preferences = useCycleStore(state => state.preferences);
  const periodLogs = useCycleStore(state => state.periodLogs);
  const loadFromServer = useCycleStore(state => state.loadFromServer);
  const setPreferences = useCycleStore(state => state.setPreferences);
  
  useEffect(() => {
    // 当组件挂载时，主动加载最新数据
    const refreshData = async () => {
      console.log('refreshData');
      try {
        setIsLoading(true);
        console.log('Starting to load fresh data on home page mount');
        
        // 确保连续尝试加载数据，最多尝试3次
        let attempts = 0;
        const maxAttempts = 3;
        let loadedData = false;
        
        while (attempts < maxAttempts && !loadedData) {
          attempts++;
          try {
            await loadFromServer();
            
            // 验证数据是否已加载
            const currentState = useCycleStore.getState();
            if (currentState.periodLogs.length > 0 || currentState.dailyLogs.length > 0) {
              loadedData = true;
              console.log(`Data loaded successfully on attempt ${attempts}:`);
              console.log(`- Period logs: ${currentState.periodLogs}`);
              console.log(`- Daily logs: ${currentState.dailyLogs.length}`);
            } else if (attempts < maxAttempts) {
              console.log(`No data loaded on attempt ${attempts}, retrying...`);
              // 等待一段时间后重试
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          } catch (attemptError) {
            console.error(`Failed to load data on attempt ${attempts}:`, attemptError);
            if (attempts < maxAttempts) {
              // 等待一段时间后重试
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }
        }
        
        if (!loadedData) {
          console.warn('Failed to load data after multiple attempts');
        }
      } catch (error) {
        console.error('Failed to refresh data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    refreshData();
  }, [loadFromServer]);

  // Monitor period logs changes and update notifications
  useEffect(() => {
    const updateNotificationsIfNeeded = async () => {
      const reminderSettings = preferences.reminders;
      
      // Only update if reminders are enabled
      if (!reminderSettings || !reminderSettings.enabled) {
        return;
      }

      // Check if user marked period as started (today is in periodLogs)
      const today = dayjs().format('YYYY-MM-DD');
      const hasMarkedTodayAsPeriod = periodLogs.includes(today);
      
      if (hasMarkedTodayAsPeriod && reminderSettings.scheduledNotificationId) {
        console.log('User marked period as started, cancelling current cycle reminder');
        
        // Cancel current notification
        await notificationManager.cancelNotification(reminderSettings.scheduledNotificationId);
        
        // Update settings to remove cancelled notification
        setPreferences({
          reminders: {
            ...reminderSettings,
            scheduledNotificationId: undefined,
            scheduledAt: undefined,
          }
        });
      }

      // Check if nextPeriodDate has changed and reschedule if needed
      const currentNextPeriod = getNextPeriodPrediction(preferences);
      if (currentNextPeriod && reminderSettings.nextPeriodDate !== currentNextPeriod.startDate) {
        console.log('Next period date changed, rescheduling notification');
        
        // Cancel old notification
        if (reminderSettings.scheduledNotificationId) {
          await notificationManager.cancelNotification(reminderSettings.scheduledNotificationId);
        }
        
        // Schedule new notification
        const newNotificationId = await notificationManager.schedulePeriodReminder(currentNextPeriod.startDate);
        
        if (newNotificationId) {
          const notificationTime = dayjs(currentNextPeriod.startDate).hour(9).minute(0).second(0);
          
          setPreferences({
            reminders: {
              enabled: true,
              scheduledNotificationId: newNotificationId,
              scheduledAt: notificationTime.format('MMM D, YYYY at 09:00'),
              nextPeriodDate: currentNextPeriod.startDate
            }
          });
        }
      }
    };

    updateNotificationsIfNeeded();
  }, [periodLogs, preferences.lastMenstrualPeriod, preferences.avgCycle]);

  const markedDates = getCalendarData(periods, preferences, currentMonth, periodLogs);
  console.log('=== Calendar Screen Debug ===');
  console.log('Current month:', currentMonth);
  console.log('Period logs from store:', periodLogs);
  console.log('Generated markedDates:', markedDates);
  console.log('MarkedDates keys:', Object.keys(markedDates));
  const cycleInfo = calculateCurrentCycle(periods, preferences);
  const nextPeriodPrediction = getNextPeriodPrediction(preferences);
  
  // 使用更健壮的日期比较方式，不依赖严格的字符串相等
  const selectedLog = dailyLogs.find(log => {
    try {
      // 解析日期并仅比较年月日部分
      const logDate = dayjs(log.date);
      const targetDate = dayjs(selectedDate);
      const isSameDate = logDate.isSame(targetDate, 'day');
      
      if (isSameDate) {
        console.log(`Found matching daily log for date ${selectedDate}:`, log);
      }
      
      return isSameDate;
    } catch (error) {
      console.error(`Error comparing dates for log ${JSON.stringify(log)}:`, error);
      return false;
    }
  });
  
  const getCycleDay = () => {
    if (!cycleInfo || !periods.length) return undefined;
    
    const lastPeriodStart = dayjs(periods[periods.length - 1].startDate);
    const selected = dayjs(selectedDate);
    
    if (selected.isSameOrAfter(lastPeriodStart)) {
      return selected.diff(lastPeriodStart, 'day') + 1;
    }
    
    return undefined;
  };

  const getLMPCycleDay = () => {
    if (!preferences.lastMenstrualPeriod) return undefined;
    
    const lmpStart = dayjs(preferences.lastMenstrualPeriod);
    const selected = dayjs(selectedDate);
    
    if (selected.isSameOrAfter(lmpStart)) {
      return selected.diff(lmpStart, 'day') + 1;
    }
    
    return undefined;
  };

  const handleAddRecord = () => {
    // 移除这个处理函数，让 DayInfoCard 使用默认的跳转逻辑
  };

  const handleMonthChange = (month: string) => {
    setCurrentMonth(month);
  };

  const handleRecordPeriod = () => {
    router.push('/period/edit');
  };

  const handleSettings = () => {
    router.push('/settings');
  };
  
  // 显示下次月经预测信息
  const renderPredictionInfo = () => {
    if (!nextPeriodPrediction) return null;
    
    const { daysFromNow, isOverdue } = nextPeriodPrediction;
    
    if (isOverdue) {
      return (
        <View style={styles.predictionCard}>
          <Text style={styles.predictionTitle}>Period may be late</Text>
          <Text style={styles.predictionText}>
            Expected start date was {Math.abs(daysFromNow)} days ago
          </Text>
        </View>
      );
    } else if (daysFromNow <= 7) {
      return (
        <View style={styles.predictionCard}>
          <Text style={styles.predictionTitle}>Next period coming soon</Text>
          <Text style={styles.predictionText}>
            Expected to start in {daysFromNow} days
          </Text>
        </View>
      );
    }
    
    return null;
  };
  
  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }]}>
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your data...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderPredictionInfo()}
          
          <View style={styles.calendarContainer}>
            <MonthCalendar
              periods={periods}
              predicted={[]}
              fertileWindow={[]}
              ovulationDay={[]}
              markedDates={markedDates}
              onDaySelect={setSelectedDate}
              selectedDate={selectedDate}
              onMonthChange={handleMonthChange}
            />
          </View>
          
          <TouchableOpacity style={styles.recordButton} onPress={handleRecordPeriod}>
            <Ionicons name="add" size={20} color={colors.white} />
            <Text style={styles.recordButtonText}>Log Period</Text>
          </TouchableOpacity>
          
          <DayInfoCard
            selectedDate={selectedDate}
            cycleDay={getCycleDay() || getLMPCycleDay()}
            dailyLog={selectedLog}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: spacing(3),
    paddingTop: spacing(1),
    paddingBottom: spacing(1),
  },
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  predictionCard: {
    backgroundColor: colors.period + '20',
    borderRadius: radii.card,
    padding: spacing(2),
    marginHorizontal: spacing(2),
    marginTop: spacing(1),
    borderLeftWidth: 4,
    borderLeftColor: colors.period,
  },
  predictionTitle: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.period,
    marginBottom: spacing(0.5),
  },
  predictionText: {
    ...typography.small,
    color: colors.period,
  },
  calendarContainer: {
  },
  recordButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing(2),
    marginBottom: spacing(2),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordButtonText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
    marginLeft: spacing(0.5),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing(3),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
  },
});