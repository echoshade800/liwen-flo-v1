import dayjs from 'dayjs';
import { PeriodEntry, DailyLog, UserProfile, Preferences } from '../store/useCycleStore';

export const DEV_SEED = false; // 开发种子数据开关

/**
 * 生成最近6个月的示例数据
 * 包含周期、经期、预测数据和3-5条DailyLog
 */
export function generateSeedData() {
  const now = dayjs();
  const periods: PeriodEntry[] = [];
  const dailyLogs: DailyLog[] = [];

  // 生成最近6个月的周期数据
  for (let i = 5; i >= 0; i--) {
    const cycleStart = now.subtract(i * 28 + Math.random() * 6 - 3, 'day'); // 25-31天周期
    const periodLength = 4 + Math.floor(Math.random() * 3); // 4-6天经期
    
    periods.push({
      startDate: cycleStart.format('YYYY-MM-DD'),
      endDate: cycleStart.add(periodLength, 'day').format('YYYY-MM-DD'),
    });

    // 为每个周期添加一些日志
    if (i <= 1) { // 只为最近两个周期添加详细日志
      const logsInCycle = 2 + Math.floor(Math.random() * 4); // 2-5条日志
      for (let j = 0; j < logsInCycle; j++) {
        const logDate = cycleStart.add(Math.floor(Math.random() * 28), 'day');
        
        dailyLogs.push({
          date: logDate.format('YYYY-MM-DD'),
          feeling: getSampleFeeling(),
          mood: getSampleMood(),
          steps: 8000 + Math.floor(Math.random() * 5000),
          distanceKm: 3 + Math.random() * 5,
          sleepHours: 6 + Math.random() * 3,
          sleepQuality: ['good', 'ok', 'poor'][Math.floor(Math.random() * 3)] as any,
          intakeWaterCups: 6 + Math.floor(Math.random() * 6),
          flow: j < periodLength ? ['light', 'medium', 'heavy'][Math.floor(Math.random() * 3)] as any : undefined,
        });
      }
    }
  }

  const profile: UserProfile = {
    age: 28,
    goal: 'track_periods',
    hasCompletedOnboarding: true,
  };

  const preferences: Preferences = {
    avgCycle: 28,
    avgPeriod: 5,
    reminders: true,
    healthSync: false,
    // 计算上次经期开始日期
    lastMenstrualPeriod: periods.length > 0 ? periods[periods.length - 1].startDate : null,
  };

  return {
    profile,
    periods,
    dailyLogs,
    preferences,
  };
}

function getSampleFeeling(): string[] {
  const feelings = ['energetic', 'tired', 'bloated', 'happy', 'anxious', 'calm'];
  const count = 1 + Math.floor(Math.random() * 2);
  return feelings.sort(() => Math.random() - 0.5).slice(0, count);
}

function getSampleMood(): string[] {
  const moods = ['happy', 'sad', 'irritable', 'anxious', 'confident', 'overwhelmed'];
  const count = 1 + Math.floor(Math.random() * 2);
  return moods.sort(() => Math.random() - 0.5).slice(0, count);
}