import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { WaterReminder } from '../types/water';

const createNotificationChannel = async () => {
  await Notifications.setNotificationChannelAsync('water-reminders', {
    name: 'Su İçme Hatırlatmaları',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#4A90E2',
    sound: 'default',
  });
};

export const waterNotificationService = {
  async initialize(): Promise<void> {
    if (Platform.OS === 'android') {
      await createNotificationChannel();
    }
  },

  async scheduleNotification(reminder: WaterReminder): Promise<string> {
    await this.initialize();

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '💧 Su İçme Zamanı',
        body: `${reminder.amount}ml su içmeyi unutmayın!`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { reminderId: reminder.id, type: 'water' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: parseInt(reminder.time.split(':')[0]),
        minute: parseInt(reminder.time.split(':')[1]),
      },
    });

    return notificationId;
  },

  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  },

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  async rescheduleAllNotifications(reminders: WaterReminder[]): Promise<void> {
    await this.cancelAllNotifications();

    for (const reminder of reminders) {
      const notificationId = await this.scheduleNotification(reminder);
      // Notification ID'yi reminder objesine kaydetmek için context'te güncelleme yapılacak
    }
  },
};

