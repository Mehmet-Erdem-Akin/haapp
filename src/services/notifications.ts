import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Medication } from '../types/medication';

// Bildirim kanalı oluştur (Android için)
const createNotificationChannel = async () => {
    await Notifications.setNotificationChannelAsync('medication-reminders', {
        name: 'İlaç Hatırlatmaları',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
    });
};

// Bildirim zamanını hesapla (bugün için)
const getNotificationDate = (time: string): Date => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    // Eğer saat geçmişse, yarın için ayarla
    if (date < new Date()) {
        date.setDate(date.getDate() + 1);
    }

    return date;
};

export const notificationService = {
    // Bildirim kanalını başlat
    async initialize(): Promise<void> {
        if (Platform.OS === 'android') {
            await createNotificationChannel();
        }
    },

    // İlaç için bildirim oluştur
    async scheduleNotification(medication: Medication): Promise<string> {
        await this.initialize();

        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'İlaç Hatırlatması',
                body: `${medication.name} (${medication.dosage}) almanın zamanı!`,
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
                data: { medicationId: medication.id },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour: parseInt(medication.time.split(':')[0]),
                minute: parseInt(medication.time.split(':')[1]),
            },
        });

        return notificationId;
    },

    // Bildirimi iptal et
    async cancelNotification(notificationId: string): Promise<void> {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
    },

    // Tüm bildirimleri iptal et
    async cancelAllNotifications(): Promise<void> {
        await Notifications.cancelAllScheduledNotificationsAsync();
    },

    // Mevcut bildirimleri yeniden planla (uygulama açıldığında)
    async rescheduleAllNotifications(medications: Medication[]): Promise<void> {
        // Önce tüm bildirimleri iptal et
        await this.cancelAllNotifications();

        // Her ilaç için yeni bildirim oluştur
        for (const medication of medications) {
            const notificationId = await this.scheduleNotification(medication);
            // Notification ID'yi medication objesine kaydetmek için context'te güncelleme yapılacak
        }
    },
};

