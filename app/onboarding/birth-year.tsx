import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useCycleStore } from '../store/useCycleStore';
import { colors, radii, spacing, typography } from '../theme/tokens';
import BirthYearPicker from '../components/BirthYearPicker';

export default function BirthYearScreen() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(2000);
  const setProfile = useCycleStore(state => state.setProfile);

  const handleContinue = () => {
    if (selectedYear) {
      // Calculate age from birth year
      const age = currentYear - selectedYear;
      
      // Save birth year and calculated age to profile
      setProfile({ 
        birthYear: selectedYear,
        age: age 
      });
      
      router.push('/onboarding/cycle-intro');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Record your birth year for more accurate predictions.</Text>
        
        <View style={styles.pickerContainer}>
          <BirthYearPicker
            value={selectedYear}
            onChange={setSelectedYear}
            minYear={1950}
            maxYear={currentYear - 10} // At least 10 years old
          />
        </View>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleContinue}
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
    justifyContent: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing(6),
    lineHeight: 32,
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radii.card,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(4),
    marginBottom: spacing(3),
  },
  buttonText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
});