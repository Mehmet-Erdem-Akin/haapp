import AsyncStorage from '@react-native-async-storage/async-storage';
import { Routine } from '../types/routine';
import { DailyRoutineRecord } from '../types/routine';

const ROUTINES_STORAGE_KEY = '@haapp_routines';
const DAILY_ROUTINES_STORAGE_KEY = '@haapp_daily_routines';

export const routineStorageService = {
  // Tüm rutinleri getir
  async getRoutines(): Promise<Routine[]> {
    try {
      const data = await AsyncStorage.getItem(ROUTINES_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Rutinler yüklenirken hata:', error);
      return [];
    }
  },

  // Rutinleri kaydet
  async saveRoutines(routines: Routine[]): Promise<void> {
    try {
      await AsyncStorage.setItem(ROUTINES_STORAGE_KEY, JSON.stringify(routines));
    } catch (error) {
      console.error('Rutinler kaydedilirken hata:', error);
      throw error;
    }
  },

  // Tüm rutinleri sil
  async clearRoutines(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ROUTINES_STORAGE_KEY);
    } catch (error) {
      console.error('Rutinler silinirken hata:', error);
      throw error;
    }
  },

  // Günlük rutin kayıtlarını getir
  async getDailyRecords(): Promise<DailyRoutineRecord[]> {
    try {
      const data = await AsyncStorage.getItem(DAILY_ROUTINES_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Günlük rutin kayıtları yüklenirken hata:', error);
      return [];
    }
  },

  // Günlük rutin kaydı kaydet
  async saveDailyRecord(record: DailyRoutineRecord): Promise<void> {
    try {
      const records = await this.getDailyRecords();
      const index = records.findIndex((r) => r.date === record.date);

      if (index >= 0) {
        records[index] = record;
      } else {
        records.push(record);
      }

      await AsyncStorage.setItem(DAILY_ROUTINES_STORAGE_KEY, JSON.stringify(records));
    } catch (error) {
      console.error('Günlük rutin kaydı kaydedilirken hata:', error);
      throw error;
    }
  },

  // Tüm günlük kayıtları sil
  async clearDailyRecords(): Promise<void> {
    try {
      await AsyncStorage.removeItem(DAILY_ROUTINES_STORAGE_KEY);
    } catch (error) {
      console.error('Günlük rutin kayıtları silinirken hata:', error);
      throw error;
    }
  },
};

