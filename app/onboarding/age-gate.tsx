import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useCycleStore } from '../store/useCycleStore';
import { colors, radii, spacing, typography } from '../theme/tokens';

const AGE_RANGES = [
  { id: '13-17', label: '13-17 years old', value: 15 },
  { id: '18-24', label: '18-24 years old', value: 21 },
  { id: '25-34', label: '25-34 years old', value: 29 },
  { id: '35-44', label: '35-44 years old', value: 39 },
  { id: '45+', label: '45+ years old', value: 47 },
];

export default function AgeGateScreen() {
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const setProfile = useCycleStore(state => state.setProfile);

  const handleContinue = () => {
    if (selectedAge) {
      if (selectedAge < 18) {
        Alert.alert(
          'Age Restriction',
          'This app is for users 18 and older. If you are under 18, please use under parental or guardian guidance.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Confirm', onPress: () => proceed() }
          ]
        );
      } else {
        proceed();
      }
    }
  };

  const proceed = () => {
    setProfile({ age: selectedAge! });
    router.push('/onboarding/feature-intro');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>What's your age range?</Text>
        <Text style={styles.subtitle}>This helps us provide more accurate advice</Text>
        
        <View style={styles.optionsContainer}>
          {AGE_RANGES.map((range) => (
            <TouchableOpacity
              key={range.id}
              style={[
                styles.option,
                selectedAge === range.value && styles.selectedOption
              ]}
              onPress={() => setSelectedAge(range.value)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.optionText,
                selectedAge === range.value && styles.selectedText
              ]}>
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity 
          style={[styles.button, !selectedAge && styles.buttonDisabled]} 
          onPress={handleContinue}
          disabled={!selectedAge}
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
  optionText: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedText: {
    color: colors.primary,
    fontWeight: '600',
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
});