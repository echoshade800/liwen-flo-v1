import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import dayjs from 'dayjs';
import { useCycleStore, DailyLog } from '../store/useCycleStore';
import { colors, radii, spacing, typography } from '../theme/tokens';
import EmojiOption from '../components/EmojiOption';

// @ts-ignore
import BrokenHealthKit, { HealthKitPermissions } from "react-native-health";
const NativeModules = require("react-native").NativeModules;
const AppleHealthKit = NativeModules.AppleHealthKit as typeof BrokenHealthKit;
AppleHealthKit.Constants = BrokenHealthKit.Constants;

const FEELING_OPTIONS = [
  { id: 'energetic', emoji: '⚡', text: 'Energetic' },
  { id: 'tired', emoji: '😴', text: 'Tired' },
  { id: 'bloated', emoji: '🎈', text: 'Bloated' },
  { id: 'happy', emoji: '😊', text: 'Happy' },
  { id: 'anxious', emoji: '😰', text: 'Anxious' },
  { id: 'calm', emoji: '😌', text: 'Calm' },
];

const FLOW_OPTIONS = [
  { id: 'light', emoji: '🩸', text: 'Light', color: '#FFB6C1' },
  { id: 'medium', emoji: '🔴', text: 'Medium', color: '#FF69B4' },
  { id: 'heavy', emoji: '🟤', text: 'Heavy', color: '#DC143C' },
  { id: 'clots', emoji: '🩸', text: 'With clots', color: '#8B0000' },
  { id: 'none', emoji: '🚫', text: 'No period today', color: '#9CA3AF' },
];

const MOOD_OPTIONS = [
  { id: 'happy', emoji: '😊', text: 'Happy' },
  { id: 'sad', emoji: '😢', text: 'Sad' },
  { id: 'irritable', emoji: '😤', text: 'Irritable' },
  { id: 'anxious', emoji: '😰', text: 'Anxious' },
  { id: 'confident', emoji: '😎', text: 'Confident' },
  { id: 'overwhelmed', emoji: '🤯', text: 'Overwhelmed' },
];

export default function DailyInsightsScreen() {
  const today = dayjs().format('YYYY-MM-DD');
  const params = useLocalSearchParams<{ date?: string }>();
  const selectedDate = (typeof params.date === 'string' && params.date) ? params.date : today;
  
  const dailyLogs = useCycleStore(state => state.dailyLogs);
  const updateDailyLog = useCycleStore(state => state.updateDailyLog);
  
  const todayLog = dailyLogs.find(log => log.date === selectedDate) || { date: selectedDate };
  const [localLog, setLocalLog] = useState<Partial<DailyLog>>(todayLog);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  // 当路由参数中的日期或全量 dailyLogs 变化时，重置本地编辑的日志
  useEffect(() => {
    const logForDate = dailyLogs.find(log => log.date === selectedDate) || { date: selectedDate };
    setLocalLog(logForDate);
  }, [selectedDate, dailyLogs]);

  // 页面加载时自动获取健康数据
  useEffect(() => {
    const initializeHealthData = async () => {
      setIsLoadingPage(true);
      
      // 如果已有所有健康数据，直接完成加载
      if (localLog.steps && localLog.distanceKm && localLog.sleepHours && localLog.sleepQuality) {
        console.log('所有健康数据已存在，跳过获取:', { 
          steps: localLog.steps, 
          distanceKm: localLog.distanceKm, 
          sleepHours: localLog.sleepHours, 
          sleepQuality: localLog.sleepQuality 
        });
        setIsLoadingPage(false);
        return;
      }
      
      // 尝试获取所有健康数据
      await fetchAllHealthData();
      setIsLoadingPage(false);
    };

    initializeHealthData();
  }, [selectedDate]); // 当选择的日期变化时重新获取

  // 从健康应用获取所有健康数据
  const fetchAllHealthData = async () => {
    if (Platform.OS !== 'ios') {
      console.log('健康数据同步仅在 iOS 设备上可用');
      return;
    }

    try {
      // 检查健康权限（与初始权限保持一致）
      const permissions = {
        permissions: {
          read: [
            AppleHealthKit.Constants.Permissions.Steps,
            AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
            AppleHealthKit.Constants.Permissions.SleepAnalysis,
            AppleHealthKit.Constants.Permissions.HeartRate
          ],
          write: [
          ]
        }
      };

      AppleHealthKit.initHealthKit(permissions, (error: any) => {
        if (error) {
          console.log('Health kit init error:', error);
          return;
        }

        // 获取选中日期的数据范围
        const startDate = dayjs(selectedDate).startOf('day').toISOString();
        const endDate = dayjs(selectedDate).endOf('day').toISOString();
        
        const options = {
          startDate: startDate,
          endDate: endDate,
        };

        // 获取步数数据
        console.log('检查步数数据:', localLog.steps);
        if (!localLog.steps) {
          console.log('开始获取步数数据...');
          AppleHealthKit.getStepCount(options, (error: any, results: any) => {
            if (error) {
              console.log('Error fetching steps:', error);
            } else if (results && results.value !== undefined) {
              const steps = Math.round(results.value);
              console.log(`Fetched ${steps} steps for ${selectedDate}`);
              handleUpdate('steps', steps);
            } else {
              console.log('该日期没有找到步数记录');
            }
          });
        }

        // 获取行走距离数据
        console.log('检查距离数据:', localLog.distanceKm);
        if (!localLog.distanceKm) {
          console.log('开始获取距离数据...');
          AppleHealthKit.getDistanceWalkingRunning(options, (error: any, results: any) => {
            if (error) {
              console.log('Error fetching distance:', error);
            } else if (results) {
              console.log(`Distance API 返回结果:`, results);
              
              let distanceKm = 0;
              
              // 处理不同的返回格式
              if (Array.isArray(results) && results.length > 0) {
                // 如果是数组，累加所有值
                const totalDistance = results.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0);
                distanceKm = totalDistance / 1000;
              } else if (results.value !== undefined) {
                // 如果是单个对象，直接使用 value
                distanceKm = results.value / 1000;
              }
              
              if (distanceKm > 0) {
                console.log(`Fetched ${distanceKm.toFixed(2)} km distance for ${selectedDate}`);
                handleUpdate('distanceKm', distanceKm);
              } else {
                console.log(`日期 ${selectedDate} 距离为 0`);
              }
            } else {
              console.log(`日期 ${selectedDate} 没有找到距离记录`);
            }
          });
        }

        // 获取睡眠数据
        if (!localLog.sleepHours || !localLog.sleepQuality) {
          // 获取前一晚的睡眠数据（通常睡眠跨越两天）
          const sleepStartDate = dayjs(selectedDate).subtract(1, 'day').startOf('day').toISOString();
          const sleepEndDate = dayjs(selectedDate).endOf('day').toISOString();
          
          const sleepOptions = {
            startDate: sleepStartDate,
            endDate: sleepEndDate,
          };

          AppleHealthKit.getSleepSamples(sleepOptions, (error: any, results: any) => {
            if (error) {
              console.log('Error fetching sleep:', error);
            } else if (results && results.length > 0) {
              // 计算总睡眠时间和质量
              let totalSleepMinutes = 0;
              let deepSleepMinutes = 0;
              
              results.forEach((sample: any) => {
                if (sample.value === 'ASLEEP' || sample.value === 'INBED') {
                  const start = new Date(sample.startDate);
                  const end = new Date(sample.endDate);
                  const minutes = (end.getTime() - start.getTime()) / (1000 * 60);
                  totalSleepMinutes += minutes;
                  
                  if (sample.value === 'ASLEEP') {
                    deepSleepMinutes += minutes;
                  }
                }
              });
              
              const sleepHours = totalSleepMinutes / 60;
              console.log(`Fetched ${sleepHours.toFixed(1)} hours sleep for ${selectedDate}`);
              
              // 根据睡眠时长判断质量
              let sleepQuality: 'good' | 'ok' | 'poor' = 'ok';
              if (sleepHours >= 7) {
                sleepQuality = 'good';
              } else if (sleepHours < 5) {
                sleepQuality = 'poor';
              }
              
              handleUpdate('sleepHours', sleepHours);
              handleUpdate('sleepQuality', sleepQuality);
            } else {
              console.log('该日期没有找到睡眠记录');
            }
          });
        }
      });
    } catch (error) {
      console.error('Error fetching health data:', error);
    }
  };

  const handleUpdate = (field: keyof DailyLog, value: any) => {
    console.log(`Updating ${field} with value:`, value);
    setLocalLog(prev => {
      const updated = { ...prev, [field]: value };
      console.log('Updated localLog:', updated);
      return updated;
    });
  };

  const handleMultiSelect = (field: 'feeling' | 'mood' | 'symptoms', optionId: string) => {
    const current = (localLog[field] as string[]) || [];
    const newValue = current.includes(optionId) 
      ? current.filter(id => id !== optionId)
      : [...current, optionId];
    
    handleUpdate(field, newValue);
  };

  const handleWaterIncrease = () => {
    const currentLiters = localLog.intakeWaterLiters || 0;
    if (currentLiters < 2.25) {
      const newAmount = Math.min(currentLiters + 0.25, 2.25);
      handleUpdate('intakeWaterLiters', newAmount);
    }
  };

  const handleWaterDecrease = () => {
    const currentLiters = localLog.intakeWaterLiters || 0;
    if (currentLiters > 0) {
      const newAmount = Math.max(currentLiters - 0.25, 0);
      handleUpdate('intakeWaterLiters', newAmount);
    }
  };

  const handleSave = () => {
    try {
      console.log('handleSave localLog', localLog);
      updateDailyLog(localLog as DailyLog);
      Alert.alert('Saved Successfully', 'Today\'s record has been saved', [
        {
          text: 'OK',
          onPress: () => router.push('/(tabs)')
        }
      ]);
    } catch (error) {
      Alert.alert('Save Failed', 'Failed to save today\'s record. Please try again.');
    }
  };

  const isToday = selectedDate === today;

  if (isLoadingPage) {
    return (
      <SafeAreaView style={[styles.container, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }]}>
        <View style={styles.loadingContainer}>
          <Ionicons name="refresh" size={40} color={colors.primary} />
          <Text style={styles.loadingText}>获取步数、距离和睡眠数据中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Insights</Text>
        <Text style={styles.subtitle}>
          {dayjs(selectedDate).format('MMM D')} {isToday && '· Today'}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🩸 Period Flow</Text>
          <View style={styles.optionsGrid}>
            {FLOW_OPTIONS.map(option => (
              <EmojiOption
                key={option.id}
                emoji={option.emoji}
                text={option.text}
                selected={localLog.flow === option.id}
                onPress={() => handleUpdate('flow', localLog.flow === option.id ? undefined : option.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌟 How You Feel</Text>
          <View style={styles.optionsGrid}>
            {FEELING_OPTIONS.map(option => (
              <EmojiOption
                key={option.id}
                emoji={option.emoji}
                text={option.text}
                selected={(localLog.feeling || []).includes(option.id)}
                onPress={() => handleMultiSelect('feeling', option.id)}
                multiSelect
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💭 Mood</Text>
          <View style={styles.optionsGrid}>
            {MOOD_OPTIONS.map(option => (
              <EmojiOption
                key={option.id}
                emoji={option.emoji}
                text={option.text}
                selected={(localLog.mood || []).includes(option.id)}
                onPress={() => handleMultiSelect('mood', option.id)}
                multiSelect
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏃‍♀️ Activity</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="walk" size={24} color={colors.primary} />
              <Text style={styles.statLabel}>Steps</Text>
              <Text style={styles.statValue}>
              {localLog.steps ? localLog.steps.toLocaleString() : '--'}
            </Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="location" size={24} color={colors.ovulation} />
              <Text style={styles.statLabel}>Distance</Text>
              <Text style={styles.statValue}>
                {localLog.distanceKm ? `${localLog.distanceKm.toFixed(1)}km` : '--'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌙 Sleep</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="time" size={24} color={colors.fertileLight} />
              <Text style={styles.statLabel}>Duration</Text>
              <Text style={styles.statValue}>
                {localLog.sleepHours ? `${localLog.sleepHours.toFixed(1)}h` : '--'}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="heart" size={24} color={colors.green} />
              <Text style={styles.statLabel}>Quality</Text>
              <Text style={styles.statValue}>
                {localLog.sleepQuality === 'good' ? 'Good' : 
                 localLog.sleepQuality === 'ok' ? 'OK' :
                 localLog.sleepQuality === 'poor' ? 'Poor' : '--'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💧 Water Intake</Text>
          <View style={styles.waterIntakeContainer}>
            <View style={styles.waterHeader}>
              <Ionicons name="water" size={24} color={colors.fertileLight} />
              <Text style={styles.waterTitle}>Water</Text>
              <View style={styles.waterControls}>
                <TouchableOpacity 
                  style={[styles.waterButton, (localLog.intakeWaterLiters || 0) <= 0 && styles.waterButtonDisabled]}
                  onPress={() => handleWaterDecrease()}
                  disabled={(localLog.intakeWaterLiters || 0) <= 0}
                >
                  <Text style={[styles.waterButtonText, (localLog.intakeWaterLiters || 0) <= 0 && styles.waterButtonTextDisabled]}>−</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.waterButton, (localLog.intakeWaterLiters || 0) >= 2.25 && styles.waterButtonDisabled]}
                  onPress={() => handleWaterIncrease()}
                  disabled={(localLog.intakeWaterLiters || 0) >= 2.25}
                >
                  <Text style={[styles.waterButtonText, (localLog.intakeWaterLiters || 0) >= 2.25 && styles.waterButtonTextDisabled]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.waterDisplay}>
              <Text style={styles.waterAmount}>
                {(localLog.intakeWaterLiters || 0).toFixed(2)}
              </Text>
              <Text style={styles.waterUnit}>/2.25 L</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Ionicons name="checkmark" size={20} color={colors.white} />
        <Text style={styles.saveButtonText}>Save Today's Record</Text>
      </TouchableOpacity>
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
  title: {
    ...typography.h2,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing(3),
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing(3),
    marginBottom: spacing(2),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(2),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing(2),
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing(0.5),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing(2),
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.gray100,
    borderRadius: radii.medium,
    padding: spacing(2),
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
  },
  statLabel: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing(0.5),
    textAlign: 'center',
  },
  statValue: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing(0.5),
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.card,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(4),
    marginHorizontal: spacing(3),
    marginBottom: spacing(3),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
    marginLeft: spacing(1),
  },
  waterIntakeContainer: {
    backgroundColor: colors.gray100,
    borderRadius: radii.medium,
    padding: spacing(2),
  },
  waterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing(2),
  },
  waterTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginLeft: spacing(1),
  },
  waterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
  },
  waterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  waterButtonDisabled: {
    backgroundColor: colors.gray300,
  },
  waterButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
  },
  waterButtonTextDisabled: {
    color: colors.textSecondary,
  },
  waterDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  waterAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  waterUnit: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: spacing(0.5),
  },
});