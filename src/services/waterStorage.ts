import AsyncStorage from '@react-native-async-storage/async-storage';
import { WaterReminder } from '../types/water';

const STORAGE_KEY = '@haapp_water_reminders';

export const waterStorageService = {
  async getReminders(): Promise<WaterReminder[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Su hatırlatmaları yüklenirken hata:', error);
      return [];
    }
  },

  async saveReminders(reminders: WaterReminder[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
    } catch (error) {
      console.error('Su hatırlatmaları kaydedilirken hata:', error);
      throw error;
    }
  },

  async clearReminders(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Su hatırlatmaları silinirken hata:', error);
      throw error;
    }
  },
};


