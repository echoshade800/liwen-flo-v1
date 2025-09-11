import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import dayjs from 'dayjs';
import { colors, radii, spacing, typography } from '../theme/tokens';
import { DailyLog, useCycleStore } from '../store/useCycleStore';
import { calculatePeriodDay } from '../lib/cycle';

interface DayInfoCardProps {
  selectedDate: string;
  cycleDay?: number;
  dailyLog?: DailyLog;
  onAddRecord?: () => void;
}

/**
 * 当日信息卡片 - 显示周期天数、步数、公里数、记录摘要
 */
export default function DayInfoCard({ selectedDate, cycleDay, dailyLog, onAddRecord }: DayInfoCardProps) {
  const formattedDate = dayjs(selectedDate).format('MMM D');
  const isToday = dayjs(selectedDate).isSame(dayjs(), 'day');
  const preferences = useCycleStore(state => state.preferences);
  const periodLogs = useCycleStore(state => state.periodLogs);
  const toNumber = (v: any): number | null => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const stepsVal = dailyLog ? toNumber((dailyLog as any).steps) : null;
  const distanceKmVal = dailyLog ? toNumber((dailyLog as any).distanceKm) : null;
  const sleepHoursVal = dailyLog ? toNumber((dailyLog as any).sleepHours) : null;
  const waterLitersVal = dailyLog ? toNumber((dailyLog as any).intakeWaterLiters) : null;
  
  // 计算经期天数
  const periodDay = calculatePeriodDay(periodLogs, selectedDate);
  
  // 检查是否是LMP期间
  const isLMPPeriod = () => {
    if (!preferences.lastMenstrualPeriod) return false;
    const lmpStart = dayjs(preferences.lastMenstrualPeriod);
    const lmpEnd = lmpStart.add(preferences.avgPeriod - 1, 'day');
    const selected = dayjs(selectedDate);
    return selected.isBetween(lmpStart, lmpEnd, 'day', '[]');
  };

  const getSummary = () => {
    if (!dailyLog) return 'No records yet';
    
    const items = [];
    
    // 经期情况
    if (dailyLog.flow) {
      const flowText = {
        'light': 'Light',
        'medium': 'Medium',
        'heavy': 'Heavy',
        'clots': 'With clots',
        'none': 'No period'
      }[dailyLog.flow] || dailyLog.flow;
      items.push(`🩸 ${flowText}`);
    }
    
    // 心情状态
    if (dailyLog.mood && dailyLog.mood.length > 0) {
      const moodText = dailyLog.mood.map(m => {
        const moodMap: Record<string, string> = {
          'calm': 'Calm',
          'happy': 'Happy',
          'energetic': 'Energetic',
          'joyful': 'Joyful',
          'mood_swings': 'Mood swings',
          'angry': 'Angry',
          'sad': 'Sad',
          'anxious': 'Anxious',
          'depressed': 'Depressed',
          'guilty': 'Guilty',
          'obsessive_thoughts': 'Obsessive thoughts',
          'listless': 'Listless',
          'apathetic': 'Apathetic',
          'confused': 'Confused',
          'perfectionistic': 'Perfectionistic'
        };
        return moodMap[m] || m;
      }).join(', ');
      items.push(`💭 ${moodText}`);
    }
    
    // 症状
    if (dailyLog.symptoms && dailyLog.symptoms.length > 0) {
      const symptomsText = dailyLog.symptoms.map(s => {
        const symptomsMap: Record<string, string> = {
          'all_good': 'All good',
          'cramps': 'Cramps',
          'breast_tenderness': 'Breast tenderness',
          'headache': 'Headache',
          'acne': 'Acne',
          'back_pain': 'Back pain',
          'fatigue': 'Fatigue',
          'cravings': 'Cravings',
          'insomnia': 'Insomnia',
          'abdominal_pain': 'Abdominal pain',
          'vaginal_itching': 'Vaginal itching',
          'vaginal_dryness': 'Vaginal dryness'
        };
        return symptomsMap[s] || s;
      }).join(', ');
      items.push(`🤕 ${symptomsText}`);
    }
    
    // 阴道分泌物
    if (dailyLog.discharge) {
      const dischargeMap: Record<string, string> = {
        'no_discharge': 'No discharge',
        'milky': 'Milky',
        'watery': 'Watery',
        'thick': 'Thick',
        'egg_white': 'Egg white–like',
        'spotting': 'Spotting',
        'abnormal': 'Abnormal',
        'white_clumpy': 'White clumpy',
        'gray': 'Gray'
      };
      const dischargeText = dischargeMap[dailyLog.discharge as string] || dailyLog.discharge;
      items.push(`💧 ${dischargeText}`);
    }
    
    // 消化和排便
    if ((dailyLog as any).digestion && (dailyLog as any).digestion.length > 0) {
      const digestionText = (dailyLog as any).digestion.map((d: string) => {
        const digestionMap: Record<string, string> = {
          'nausea': 'Nausea',
          'bloating': 'Bloating',
          'constipation': 'Constipation',
          'diarrhea': 'Diarrhea'
        };
        return digestionMap[d] || d;
      }).join(', ');
      items.push(`🚽 ${digestionText}`);
    }
    
    // 其他活动
    if ((dailyLog as any).others && (dailyLog as any).others.length > 0) {
      const othersText = (dailyLog as any).others.map((o: string) => {
        const othersMap: Record<string, string> = {
          'travel': 'Travel',
          'stress': 'Stress',
          'meditation': 'Meditation',
          'journal': 'Journal',
          'kegel_training': 'Kegel training',
          'breathwork': 'Breathwork',
          'illness_injury': 'Illness or injury',
          'alcohol': 'Alcohol'
        };
        return othersMap[o] || o;
      }).join(', ');
      items.push(`📝 ${othersText}`);
    }
    
    // 体力活动
    if ((dailyLog as any).physicalActivity && (dailyLog as any).physicalActivity.length > 0) {
      const activityText = (dailyLog as any).physicalActivity.map((a: string) => {
        const activityMap: Record<string, string> = {
          'no_exercise': 'No exercise',
          'yoga': 'Yoga',
          'gym': 'Gym',
          'aerobics_dance': 'Aerobics & dance',
          'swimming': 'Swimming',
          'team_sports': 'Team sports',
          'running': 'Running',
          'cycling': 'Cycling',
          'walking': 'Walking'
        };
        return activityMap[a] || a;
      }).join(', ');
      items.push(`🏃‍♀️ ${activityText}`);
    }
    
    return items.length > 0 ? items.join(' · ') : 'No records yet';
  };

  const handleAddRecord = () => {
    if (onAddRecord) {
      onAddRecord();
    } else {
      // 跳转到每日见解页面
      router.push({ pathname: '/(tabs)/daily-insights', params: { date: selectedDate } });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>
          {formattedDate} {isToday && '· Today'}
        </Text>
        {(cycleDay || periodDay) && (
          <Text style={styles.cycleDay}>
            {periodDay ? `Period day ${periodDay}` : 
             isLMPPeriod() ? 'Last menstrual period' : 
             `Cycle day ${cycleDay}`}
          </Text>
        )}
      </View>

      {/* Stats */}
      {dailyLog && (
        <View style={styles.stats}>
          {stepsVal !== null && (
            <View style={styles.statItem}>
              <Ionicons name="walk" size={16} color={colors.primary} />
              <Text style={styles.statText}>{stepsVal.toLocaleString()} steps</Text>
            </View>
          )}
          {distanceKmVal !== null && (
            <View style={styles.statItem}>
              <Ionicons name="location" size={16} color={colors.primary} />
              <Text style={styles.statText}>{distanceKmVal.toFixed(1)} km</Text>
            </View>
          )}
          {sleepHoursVal !== null && (
            <View style={styles.statItem}>
              <Ionicons name="moon" size={16} color={colors.primary} />
              <Text style={styles.statText}>{sleepHoursVal.toFixed(1)}h sleep</Text>
            </View>
          )}
          {waterLitersVal !== null && waterLitersVal > 0 && (
            <View style={styles.statItem}>
              <Ionicons name="water" size={16} color={colors.fertileLight} />
              <Text style={styles.statText}>{waterLitersVal.toFixed(1)}L water</Text>
            </View>
          )}
        </View>
      )}

      {/* Summary */}
      <Text style={styles.summary}>{getSummary()}</Text>

      {/* Add Record Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddRecord} activeOpacity={0.7}>
        <Ionicons name="add" size={20} color={colors.white} />
        <Text style={styles.addButtonText}>Log {isToday ? 'Today' : 'This Day'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing(2),
    margin: spacing(2),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: spacing(1.5),
  },
  date: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  cycleDay: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing(1.5),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing(2),
    marginBottom: spacing(0.5),
  },
  statText: {
    ...typography.caption,
    color: colors.text,
    marginLeft: spacing(0.5),
  },
  summary: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing(2),
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.medium,
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
    marginLeft: spacing(0.5),
  },
});