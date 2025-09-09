import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Switch } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCycleStore } from '../store/useCycleStore';
import { colors, radii, spacing, typography } from '../theme/tokens';

export default function HealthAndNotificationsScreen() {
  const [reminders, setReminders] = useState(true);
  const [healthSync, setHealthSync] = useState(false);
  
  const setPreferences = useCycleStore(state => state.setPreferences);

  const handleContinue = () => {
    setPreferences({
      reminders,
      healthSync,
    });
    
    router.push('/onboarding/done');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Enhance your experience</Text>
        <Text style={styles.subtitle}>These settings can be changed later</Text>
        
        <View style={styles.section}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="notifications" size={24} color={colors.primary} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.sectionTitle}>Smart Reminders</Text>
              <Text style={styles.sectionDesc}>
                Remind you to log on key dates to help maintain tracking habits
              </Text>
            </View>
            <Switch
              value={reminders}
              onValueChange={setReminders}
              trackColor={{ false: colors.gray300, true: colors.primary + '40' }}
              thumbColor={reminders ? colors.primary : colors.gray600}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="fitness" size={24} color={colors.ovulation} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.sectionTitle}>Health Data Sync</Text>
              <Text style={styles.sectionDesc}>
                Automatically get steps, sleep and other data for more comprehensive health insights
              </Text>
            </View>
            <Switch
              value={healthSync}
              onValueChange={setHealthSync}
              trackColor={{ false: colors.gray300, true: colors.ovulation + '40' }}
              thumbColor={healthSync ? colors.ovulation : colors.gray600}
            />
          </View>
          
          {healthSync && (
            <View style={styles.healthInfo}>
              <Text style={styles.healthInfoText}>
                📱 This is a demo version. The actual app would connect to HealthKit or Google Fit
              </Text>
            </View>
          )}
        </View>

        <View style={styles.privacySection}>
          <Ionicons name="shield-checkmark" size={20} color={colors.green} />
          <Text style={styles.privacyText}>
            Your data is completely private and secure. We use encryption to protect your information 
            and will never share your health data with third parties.
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Complete Setup</Text>
      </TouchableOpacity>
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
    paddingTop: spacing(4),
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing(1),
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing(4),
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing(3),
    marginBottom: spacing(3),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: spacing(2),
    marginTop: spacing(0.5),
  },
  textContainer: {
    flex: 1,
    marginRight: spacing(2),
  },
  sectionTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  sectionDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  healthInfo: {
    marginTop: spacing(2),
    padding: spacing(2),
    backgroundColor: colors.ovulation + '10',
    borderRadius: radii.medium,
  },
  healthInfoText: {
    ...typography.small,
    color: colors.ovulation,
    lineHeight: 16,
  },
  privacySection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.green + '10',
    padding: spacing(2.5),
    borderRadius: radii.card,
    marginTop: spacing(2),
  },
  privacyText: {
    ...typography.caption,
    color: colors.green,
    lineHeight: 18,
    marginLeft: spacing(1),
    flex: 1,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radii.card,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(4),
    marginHorizontal: spacing(3),
    marginBottom: spacing(3),
  },
  buttonText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
});