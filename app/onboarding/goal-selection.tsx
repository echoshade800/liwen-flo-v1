import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useCycleStore } from '../store/useCycleStore';
import { colors, radii, spacing, typography } from '../theme/tokens';

const GOALS = [
  { id: 'track_periods', title: 'Track periods', subtitle: 'Understand your menstrual cycle patterns', emoji: '🩸' },
  { id: 'get_pregnant', title: 'Plan pregnancy', subtitle: 'Find the best time to conceive', emoji: '🤰' },
  { id: 'avoid_pregnancy', title: 'Avoid pregnancy', subtitle: 'Learn about safe periods', emoji: '💊' },
  { id: 'track_symptoms', title: 'Track symptoms', subtitle: 'Record period-related symptoms', emoji: '📝' },
];

export default function GoalSelectionScreen() {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const setProfile = useCycleStore(state => state.setProfile);

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) {
        return prev.filter(id => id !== goalId);
      } else {
        return [...prev, goalId];
      }
    });
  };
  const handleContinue = () => {
    if (selectedGoals.length > 0) {
      // Save selected goals as an array or comma-separated string
      setProfile({ goal: selectedGoals.join(',') });
      router.push('/onboarding/age-gate');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>What are your goals?</Text>
        <Text style={styles.subtitle}>Select all that apply, you can change them later</Text>
        
        <View style={styles.optionsContainer}>
          {GOALS.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.option,
                selectedGoals.includes(goal.id) && styles.selectedOption
              ]}
              onPress={() => handleGoalToggle(goal.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{goal.emoji}</Text>
              <View style={styles.textContent}>
                <Text style={[
                  styles.optionTitle,
                  selectedGoals.includes(goal.id) && styles.selectedText
                ]}>
                  {goal.title}
                </Text>
                <Text style={styles.optionSubtitle}>{goal.subtitle}</Text>
              </View>
              {selectedGoals.includes(goal.id) && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity 
          style={[styles.button, selectedGoals.length === 0 && styles.buttonDisabled]} 
          onPress={handleContinue}
          disabled={selectedGoals.length === 0}
        >
          <Text style={styles.buttonText}>Continue</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing(3),
    paddingTop: spacing(6),
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing(1),
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing(4),
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing(2.5),
    marginBottom: spacing(2),
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  emoji: {
    fontSize: 24,
    marginRight: spacing(2),
  },
  textContent: {
    flex: 1,
  },
  optionTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  selectedText: {
    color: colors.primary,
  },
  optionSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radii.card,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(4),
    marginBottom: spacing(3),
  },
  buttonDisabled: {
    backgroundColor: colors.gray300,
  },
  buttonText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing(1),
  },
  checkmarkText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});