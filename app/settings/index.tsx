import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Switch, TouchableOpacity, Platform, StatusBar, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useCycleStore } from '../store/useCycleStore';
import { notificationManager } from '../lib/notificationManager';
import { colors, radii, spacing, typography } from '../theme/tokens';

export default function SettingsScreen() {
  const [isUpdatingNotifications, setIsUpdatingNotifications] = useState(false);
  
  const preferences = useCycleStore(state => state.preferences);
  const setPreferences = useCycleStore(state => state.setPreferences);
  const periodLogs = useCycleStore(state => state.periodLogs);

  // Get current notification settings
  const notificationSettings = preferences.reminders || { enabled: false };
  const isNotificationsEnabled = notificationSettings.enabled || false;

  // Calculate next period date for display
  const getNextPeriodInfo = () => {
    if (!preferences.lastMenstrualPeriod) {
      return null;
    }

    const nextPeriodDate = dayjs(preferences.lastMenstrualPeriod)
      .add(preferences.avgCycle, 'day');
    
    const notificationTime = nextPeriodDate.hour(9).minute(0).second(0);
    
    return {
      date: nextPeriodDate.format('YYYY-MM-DD'),
      displayDate: nextPeriodDate.format('MMM D'),
      notificationTime: notificationTime.format('MMM D, YYYY at 09:00'),
      isPast: notificationTime.isBefore(dayjs())
    };
  };

  const nextPeriodInfo = getNextPeriodInfo();

  const handleNotificationToggle = async (enabled: boolean) => {
    setIsUpdatingNotifications(true);
    
    try {
      if (enabled) {
        // Enable notifications
        if (!nextPeriodInfo) {
          Alert.alert(
            'No Period Data',
            'Please log your period dates first to enable reminders.',
            [{ text: 'OK' }]
          );
          setIsUpdatingNotifications(false);
          return;
        }

        if (nextPeriodInfo.isPast) {
          Alert.alert(
            'Past Date',
            'Your next predicted period date has already passed. Please update your period data to enable reminders.',
            [{ text: 'OK' }]
          );
          setIsUpdatingNotifications(false);
          return;
        }

        // Schedule notification
        const notificationId = await notificationManager.schedulePeriodReminder(nextPeriodInfo.date);
        
        if (notificationId) {
          // Save notification settings
          setPreferences({
            reminders: {
              enabled: true,
              scheduledNotificationId: notificationId,
              scheduledAt: nextPeriodInfo.notificationTime,
              nextPeriodDate: nextPeriodInfo.date
            }
          });
          
          Alert.alert(
            'Reminder Set',
            `You'll get a reminder on ${nextPeriodInfo.notificationTime}.`,
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'Failed to Set Reminder',
            'Unable to schedule notification. Please check your notification permissions.',
            [{ text: 'OK' }]
          );
        }
      } else {
        // Disable notifications
        if (notificationSettings.scheduledNotificationId) {
          await notificationManager.cancelNotification(notificationSettings.scheduledNotificationId);
        }
        
        // Also cancel any other period reminders
        await notificationManager.cancelAllPeriodReminders();
        
        // Update settings
        setPreferences({
          reminders: {
            enabled: false,
            scheduledNotificationId: undefined,
            scheduledAt: undefined,
            nextPeriodDate: undefined
          }
        });
        
        Alert.alert(
          'Reminders Disabled',
          'Period reminders have been turned off.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      Alert.alert(
        'Error',
        'Failed to update notification settings. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsUpdatingNotifications(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="notifications" size={24} color={colors.primary} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.sectionTitle}>Period Reminders</Text>
              <Text style={styles.sectionDesc}>
                Get notified on your predicted period start date
              </Text>
            </View>
            <Switch
              value={isNotificationsEnabled}
              onValueChange={handleNotificationToggle}
              disabled={isUpdatingNotifications}
              trackColor={{ false: colors.gray300, true: colors.primary + '40' }}
              thumbColor={isNotificationsEnabled ? colors.primary : colors.gray600}
            />
          </View>
          
          {isNotificationsEnabled && nextPeriodInfo && (
            <View style={styles.reminderInfo}>
              <Text style={styles.reminderInfoText}>
                📅 Next reminder: {nextPeriodInfo.notificationTime}
              </Text>
              {nextPeriodInfo.isPast && (
                <Text style={styles.warningText}>
                  ⚠️ This date has passed. Update your period data to reschedule.
                </Text>
              )}
            </View>
          )}
          
          {isNotificationsEnabled && !nextPeriodInfo && (
            <View style={styles.reminderInfo}>
              <Text style={styles.warningText}>
                ⚠️ No period data available. Log your periods to enable reminders.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="information-circle" size={24} color={colors.ovulation} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.sectionTitle}>About Reminders</Text>
              <Text style={styles.sectionDesc}>
                Reminders are sent at 09:00 on your predicted period start date. 
                They help you prepare and stay on top of your cycle.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={24} color={colors.green} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.sectionTitle}>Privacy & Security</Text>
              <Text style={styles.sectionDesc}>
                All notifications are processed locally on your device. 
                Your health data is never shared with third parties.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray300,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing(3),
    paddingTop: spacing(2),
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
  sectionHeader: {
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
  reminderInfo: {
    marginTop: spacing(2),
    padding: spacing(2),
    backgroundColor: colors.primary + '10',
    borderRadius: radii.medium,
  },
  reminderInfoText: {
    ...typography.caption,
    color: colors.primary,
    lineHeight: 18,
  },
  warningText: {
    ...typography.caption,
    color: colors.red,
    lineHeight: 18,
  },
});