import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { colors, radii, spacing, typography } from '../theme/tokens';

export default function PeriodPredictionScreen() {
  const params = useLocalSearchParams();
  const predictedDate = params.predictedDate as string;

  const handleNext = () => {
    router.push('/onboarding/done');
  };

  const formatPredictedDate = (dateString: string) => {
    return dayjs(dateString).format('MMMM D');
  };

  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }]}>
      <View style={styles.content}>
        {/* Bell Icon Container */}
        <View style={styles.iconContainer}>
          <View style={styles.bellBackground}>
            <Ionicons name="notifications" size={48} color={colors.white} />
          </View>
        </View>

        {/* App Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>PERIOD</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Your next period will likely start on{' '}
            <Text style={styles.dateHighlight}>
              {formatPredictedDate(predictedDate)}
            </Text>
          </Text>
          
          <Text style={styles.subtitle}>
            Want to get reminders before your period starts? You can easily enable 
            "Notifications" in the next screen.
          </Text>
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
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
    justifyContent: 'space-between',
    paddingTop: spacing(8),
    paddingBottom: spacing(4),
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing(4),
  },
  bellBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.period,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing(6),
  },
  logo: {
    backgroundColor: colors.period,
    borderRadius: radii.medium,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
  },
  logoText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
    letterSpacing: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing(2),
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: spacing(3),
  },
  dateHighlight: {
    color: colors.period,
    fontWeight: '700',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing(1),
  },
  button: {
    backgroundColor: colors.period,
    borderRadius: radii.pill,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(4),
    marginHorizontal: spacing(2),
  },
  buttonText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
});