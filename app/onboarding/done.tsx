import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useCycleStore } from '../store/useCycleStore';
import { colors, radii, spacing, typography } from '../theme/tokens';

export default function OnboardingDoneScreen() {
  const completeOnboarding = useCycleStore(state => state.completeOnboarding);

  const handleStart = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.celebration}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>You're all set!</Text>
          <Text style={styles.subtitle}>Your personalized period companion is ready</Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>📅</Text>
            <Text style={styles.featureText}>View personalized calendar and predictions</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>💡</Text>
            <Text style={styles.featureText}>Log daily feelings and symptoms</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>📈</Text>
            <Text style={styles.featureText}>Track health trends</Text>
          </View>
        </View>

        <Text style={styles.encouragement}>
          Remember, consistent logging is key to understanding your body's patterns.
          Even logging just a few key details is valuable!
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>Start My Health Journey</Text>
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
    alignItems: 'center',
  },
  celebration: {
    alignItems: 'center',
    marginBottom: spacing(6),
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing(2),
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing(1),
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    alignSelf: 'stretch',
    marginBottom: spacing(4),
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing(2.5),
    borderRadius: radii.card,
    marginBottom: spacing(2),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: spacing(2),
  },
  featureText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  encouragement: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing(4),
    paddingHorizontal: spacing(2),
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radii.card,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(4),
    alignSelf: 'stretch',
  },
  buttonText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
});