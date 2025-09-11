import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import dayjs from 'dayjs';
import { useCycleStore, DailyLog } from '../store/useCycleStore';
import { colors, radii, spacing, typography } from '../theme/tokens';
import EmojiOption from '../components/EmojiOption';

const MOOD_OPTIONS = [
  { id: 'calm', emoji: '😌', text: 'Calm' },
  { id: 'happy', emoji: '🙂', text: 'Happy' },
  { id: 'energetic', emoji: '⚡️', text: 'Energetic' },
  { id: 'joyful', emoji: '😄', text: 'Joyful' },
  { id: 'mood_swings', emoji: '🔄', text: 'Mood swings' },
  { id: 'angry', emoji: '😠', text: 'Angry' },
  { id: 'sad', emoji: '😢', text: 'Sad' },
  { id: 'anxious', emoji: '😟', text: 'Anxious' },
  { id: 'depressed', emoji: '😞', text: 'Depressed' },
  { id: 'guilty', emoji: '😔', text: 'Guilty' },
  { id: 'obsessive_thoughts', emoji: '🔄🧠', text: 'Obsessive thoughts' },
  { id: 'listless', emoji: '😴', text: 'Listless' },
  { id: 'apathetic', emoji: '😑', text: 'Apathetic' },
  { id: 'confused', emoji: '😕', text: 'Confused' },
  { id: 'perfectionistic', emoji: '🎯', text: 'Perfectionistic (very high self-expectations)' },
];

const SYMPTOMS_OPTIONS = [
  { id: 'all_good', emoji: '👍', text: 'All good' },
  { id: 'cramps', emoji: '🤕', text: 'Cramps' },
  { id: 'breast_tenderness', emoji: '🤕', text: 'Breast tenderness' },
  { id: 'headache', emoji: '🤕', text: 'Headache' },
  { id: 'acne', emoji: '🧴', text: 'Acne' },
  { id: 'back_pain', emoji: '🦴', text: 'Back pain' },
  { id: 'fatigue', emoji: '😴', text: 'Fatigue' },
  { id: 'cravings', emoji: '🍫', text: 'Cravings' },
  { id: 'insomnia', emoji: '🌙', text: 'Insomnia' },
  { id: 'abdominal_pain', emoji: '🤒', text: 'Abdominal pain' },
  { id: 'vaginal_itching', emoji: '🪶', text: 'Vaginal itching' },
  { id: 'vaginal_dryness', emoji: '🌵', text: 'Vaginal dryness' },
];

const DISCHARGE_OPTIONS = [
  { id: 'no_discharge', emoji: '🚫💧', text: 'No discharge' },
  { id: 'milky', emoji: '🥛', text: 'Milky' },
  { id: 'watery', emoji: '💧', text: 'Watery' },
  { id: 'thick', emoji: '🧴', text: 'Thick' },
  { id: 'egg_white', emoji: '🥚', text: 'Egg white–like' },
  { id: 'spotting', emoji: '🩸', text: 'Spotting' },
  { id: 'abnormal', emoji: '⚠️', text: 'Abnormal' },
  { id: 'white_clumpy', emoji: '🤍🫧', text: 'White clumpy' },
  { id: 'gray', emoji: '⚪️', text: 'Gray' },
];

const DIGESTION_OPTIONS = [
  { id: 'nausea', emoji: '🤢', text: 'Nausea' },
  { id: 'bloating', emoji: '🎈', text: 'Bloating' },
  { id: 'constipation', emoji: '🚫🚽', text: 'Constipation' },
  { id: 'diarrhea', emoji: '💩', text: 'Diarrhea' },
];

const OTHERS_OPTIONS = [
  { id: 'travel', emoji: '✈️', text: 'Travel' },
  { id: 'stress', emoji: '⚡️', text: 'Stress' },
  { id: 'meditation', emoji: '🧘', text: 'Meditation' },
  { id: 'journal', emoji: '📓', text: 'Journal' },
  { id: 'kegel_training', emoji: '🧘‍♀️', text: 'Kegel training' },
  { id: 'breathwork', emoji: '🌬️', text: 'Breathwork' },
  { id: 'illness_injury', emoji: '🤒🩹', text: 'Illness or injury' },
  { id: 'alcohol', emoji: '🍷', text: 'Alcohol' },
];

const PHYSICAL_ACTIVITY_OPTIONS = [
  { id: 'no_exercise', emoji: '🛋️', text: 'No exercise' },
  { id: 'yoga', emoji: '🧘', text: 'Yoga' },
  { id: 'gym', emoji: '🏋️', text: 'Gym' },
  { id: 'aerobics_dance', emoji: '💃', text: 'Aerobics & dance' },
  { id: 'swimming', emoji: '🏊', text: 'Swimming' },
  { id: 'team_sports', emoji: '🏀', text: 'Team sports' },
  { id: 'running', emoji: '🏃', text: 'Running' },
  { id: 'cycling', emoji: '🚴', text: 'Cycling' },
  { id: 'walking', emoji: '🚶', text: 'Walking' },
];

const FLOW_OPTIONS = [
  { id: 'light', emoji: '🩸', text: 'Light', color: '#FFB6C1' },
  { id: 'medium', emoji: '🔴', text: 'Medium', color: '#FF69B4' },
  { id: 'heavy', emoji: '🟤', text: 'Heavy', color: '#DC143C' },
  { id: 'clots', emoji: '🩸', text: 'With clots', color: '#8B0000' },
  { id: 'none', emoji: '🚫', text: 'No period today', color: '#9CA3AF' },
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
    setIsLoadingPage(false);
  }, [selectedDate, dailyLogs]);

  const handleUpdate = (field: keyof DailyLog, value: any) => {
    console.log(`Updating ${field} with value:`, value);
    setLocalLog(prev => {
      const updated = { ...prev, [field]: value };
      console.log('Updated localLog:', updated);
      return updated;
    });
  };

  const handleMultiSelect = (field: 'mood' | 'symptoms' | 'discharge' | 'digestion' | 'others' | 'physicalActivity', optionId: string) => {
    const current = (localLog[field] as string[]) || [];
    
    // Handle exclusive options for symptoms
    if (field === 'symptoms') {
      if (optionId === 'all_good') {
        // If selecting "All good", clear all other symptoms
        const newValue = current.includes('all_good') ? [] : ['all_good'];
        handleUpdate(field, newValue);
        return;
      } else {
        // If selecting any symptom, remove "All good"
        const filteredCurrent = current.filter(id => id !== 'all_good');
        const newValue = filteredCurrent.includes(optionId) 
          ? filteredCurrent.filter(id => id !== optionId)
          : [...filteredCurrent, optionId];
        handleUpdate(field, newValue);
        return;
      }
    }
    
    // Normal multi-select behavior for other fields
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
          <Text style={styles.sectionTitle}>🤕 Symptoms</Text>
          <View style={styles.optionsGrid}>
            {SYMPTOMS_OPTIONS.map(option => (
              <EmojiOption
                key={option.id}
                emoji={option.emoji}
                text={option.text}
                selected={(localLog.symptoms || []).includes(option.id)}
                onPress={() => handleMultiSelect('symptoms', option.id)}
                multiSelect
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💧 Vaginal Discharge</Text>
          <View style={styles.optionsGrid}>
            {DISCHARGE_OPTIONS.map(option => (
              <EmojiOption
                key={option.id}
                emoji={option.emoji}
                text={option.text}
                selected={(localLog.discharge as any) === option.id}
                onPress={() => handleUpdate('discharge', localLog.discharge === option.id ? undefined : option.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚽 Digestion & Bowel Movements</Text>
          <View style={styles.optionsGrid}>
            {DIGESTION_OPTIONS.map(option => (
              <EmojiOption
                key={option.id}
                emoji={option.emoji}
                text={option.text}
                selected={((localLog as any).digestion || []).includes(option.id)}
                onPress={() => handleMultiSelect('digestion', option.id)}
                multiSelect
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Others</Text>
          <View style={styles.optionsGrid}>
            {OTHERS_OPTIONS.map(option => (
              <EmojiOption
                key={option.id}
                emoji={option.emoji}
                text={option.text}
                selected={((localLog as any).others || []).includes(option.id)}
                onPress={() => handleMultiSelect('others', option.id)}
                multiSelect
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏃‍♀️ Physical Activity</Text>
          <View style={styles.optionsGrid}>
            {PHYSICAL_ACTIVITY_OPTIONS.map(option => (
              <EmojiOption
                key={option.id}
                emoji={option.emoji}
                text={option.text}
                selected={((localLog as any).physicalActivity || []).includes(option.id)}
                onPress={() => handleMultiSelect('physicalActivity', option.id)}
                multiSelect
              />
            ))}
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
});