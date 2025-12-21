import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WaterReminder, WaterContextType } from '../types/water';
import { waterStorageService } from '../services/waterStorage';
import { waterNotificationService } from '../services/waterNotifications';

const WaterContext = createContext<WaterContextType | undefined>(undefined);

export const WaterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reminders, setReminders] = useState<WaterReminder[]>([]);

  useEffect(() => {
    loadReminders();
  }, []);

  useEffect(() => {
    if (reminders.length > 0) {
      waterNotificationService.rescheduleAllNotifications(reminders);
    }
  }, [reminders.length]);

  const loadReminders = async () => {
    try {
      const loadedReminders = await waterStorageService.getReminders();
      setReminders(loadedReminders);
    } catch (error) {
      console.error('Su hatırlatmaları yüklenirken hata:', error);
    }
  };

  const addReminder = async (reminderData: Omit<WaterReminder, 'id' | 'notificationId'>) => {
    try {
      const newReminder: WaterReminder = {
        ...reminderData,
        id: Date.now().toString(),
      };

      try {
        const notificationId = await waterNotificationService.scheduleNotification(newReminder);
        newReminder.notificationId = notificationId;
      } catch (notificationError) {
        console.warn('Bildirim oluşturulamadı, hatırlatma yine de kaydediliyor:', notificationError);
      }

      const updatedReminders = [...reminders, newReminder];
      setReminders(updatedReminders);
      await waterStorageService.saveReminders(updatedReminders);
    } catch (error) {
      console.error('Su hatırlatması eklenirken hata:', error);
      throw error;
    }
  };

  const addBulkReminders = async (remindersData: Omit<WaterReminder, 'id' | 'notificationId'>[]) => {
    try {
      const newReminders: WaterReminder[] = [];
      let baseId = Date.now();

      for (const reminderData of remindersData) {
        const newReminder: WaterReminder = {
          ...reminderData,
          id: `${baseId}-${newReminders.length}`,
        };

        try {
          const notificationId = await waterNotificationService.scheduleNotification(newReminder);
          newReminder.notificationId = notificationId;
        } catch (notificationError) {
          console.warn('Bildirim oluşturulamadı, hatırlatma yine de kaydediliyor:', notificationError);
        }

        newReminders.push(newReminder);
      }

      const updatedReminders = [...reminders, ...newReminders];
      setReminders(updatedReminders);
      await waterStorageService.saveReminders(updatedReminders);
    } catch (error) {
      console.error('Toplu su hatırlatması eklenirken hata:', error);
      throw error;
    }
  };

  const updateReminder = async (id: string, updates: Partial<WaterReminder>) => {
    try {
      const updatedReminders = reminders.map((reminder) => {
        if (reminder.id === id) {
          const updated = { ...reminder, ...updates };
          
          if (updates.time && updates.time !== reminder.time) {
            if (reminder.notificationId) {
              waterNotificationService.cancelNotification(reminder.notificationId);
            }
            waterNotificationService.scheduleNotification(updated).then((notificationId) => {
              updated.notificationId = notificationId;
            });
          }
          
          return updated;
        }
        return reminder;
      });

      setReminders(updatedReminders);
      await waterStorageService.saveReminders(updatedReminders);
    } catch (error) {
      console.error('Su hatırlatması güncellenirken hata:', error);
      throw error;
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      const reminder = reminders.find((r) => r.id === id);
      if (reminder?.notificationId) {
        await waterNotificationService.cancelNotification(reminder.notificationId);
      }

      const updatedReminders = reminders.filter((r) => r.id !== id);
      setReminders(updatedReminders);
      await waterStorageService.saveReminders(updatedReminders);
    } catch (error) {
      console.error('Su hatırlatması silinirken hata:', error);
      throw error;
    }
  };

  return (
    <WaterContext.Provider
      value={{
        reminders,
        addReminder,
        addBulkReminders,
        updateReminder,
        deleteReminder,
        loadReminders,
      }}
    >
      {children}
    </WaterContext.Provider>
  );
};

export const useWater = () => {
  const context = useContext(WaterContext);
  if (!context) {
    throw new Error('useWater must be used within WaterProvider');
  }
  return context;
};

