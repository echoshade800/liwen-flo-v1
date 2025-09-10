import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import dayjs from 'dayjs';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface PeriodReminderSettings {
  enabled: boolean;
  scheduledNotificationId?: string;
  scheduledAt?: string;
  nextPeriodDate?: string;
}

class NotificationManager {
  /**
   * Request notification permissions (iOS only)
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      return true; // Skip for non-iOS platforms
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      console.log('Notification permission status:', finalStatus);
      return finalStatus === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Schedule period reminder notification
   */
  async schedulePeriodReminder(nextPeriodDate: string): Promise<string | null> {
    try {
      // Check permissions first
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('Notification permission not granted');
        return null;
      }

      // Calculate notification time: nextPeriodDate at 09:00 local time
      const notificationDate = dayjs(nextPeriodDate)
        .hour(9)
        .minute(0)
        .second(0);

      // Check if the notification time is in the future
      if (notificationDate.isBefore(dayjs())) {
        console.warn('Notification time is in the past, skipping scheduling');
        return null;
      }

      console.log('Scheduling period reminder for:', notificationDate.format('YYYY-MM-DD HH:mm:ss'));
      console.log('Current time:', dayjs().format('YYYY-MM-DD HH:mm:ss'));
      console.log('Time until notification:', notificationDate.diff(dayjs(), 'minute'), 'minutes');

      // Schedule the notification
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Heads up—your period might start today!',
          body: 'Hey, based on your cycle records, today could be day 1 of your period. Remember to grab supplies (pads, tampons, or cups), a heating pad for cramps, and your usual pain reliever.\n\nIf it\'s already here, just log it in the app—tracking helps us keep your cycle on your radar. Take it easy today! 🌸',
          sound: 'default',
        },
        trigger: {
          date: notificationDate.toDate(),
        },
      });

      console.log('Period reminder scheduled with ID:', notificationId);
      console.log('Notification will trigger at:', notificationDate.toDate());
      return notificationId;
    } catch (error) {
      console.error('Error scheduling period reminder:', error);
      return null;
    }
  }

  /**
   * Cancel a specific notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('Cancelled notification:', notificationId);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  /**
   * Cancel all period reminder notifications
   */
  async cancelAllPeriodReminders(): Promise<void> {
    try {
      // Get all scheduled notifications
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      // Filter period reminder notifications (by title)
      const periodNotifications = scheduledNotifications.filter(
        notification => notification.content.title?.includes('period might start')
      );

      // Cancel each period notification
      for (const notification of periodNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }

      console.log(`Cancelled ${periodNotifications.length} period reminder notifications`);
    } catch (error) {
      console.error('Error cancelling all period reminders:', error);
    }
  }

  /**
   * Get all scheduled notifications (for debugging)
   */
  async getScheduledNotifications() {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      console.log('Scheduled notifications:', notifications);
      return notifications;
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }
}

export const notificationManager = new NotificationManager();