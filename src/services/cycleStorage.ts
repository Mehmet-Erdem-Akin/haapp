import AsyncStorage from '@react-native-async-storage/async-storage';
import { CycleSettings, MenstrualCycleData, CycleRecord, MonthlyGoal } from '../types/cycle';

const CYCLE_SETTINGS_KEY = '@haapp_cycle_settings';
const MENSTRUAL_DATA_KEY = '@haapp_menstrual_data';
const CYCLE_RECORDS_KEY = '@haapp_cycle_records';
const MONTHLY_GOALS_KEY = '@haapp_monthly_goals';

export const cycleStorageService = {
  // Cycle Settings
  async getSettings(): Promise<CycleSettings> {
    try {
      const data = await AsyncStorage.getItem(CYCLE_SETTINGS_KEY);
      if (data) {
        return JSON.parse(data);
      }
      // Default settings
      return {
        isActive: false,
        cycleType: 'general',
      };
    } catch (error) {
      console.error('Cycle ayarları yüklenirken hata:', error);
      return {
        isActive: false,
        cycleType: 'general',
      };
    }
  },

  async saveSettings(settings: CycleSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(CYCLE_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Cycle ayarları kaydedilirken hata:', error);
      throw error;
    }
  },

  // Menstrual Cycle Data
  async getMenstrualData(): Promise<MenstrualCycleData | null> {
    try {
      const data = await AsyncStorage.getItem(MENSTRUAL_DATA_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Menstrual cycle data yüklenirken hata:', error);
      return null;
    }
  },

  async saveMenstrualData(data: MenstrualCycleData): Promise<void> {
    try {
      await AsyncStorage.setItem(MENSTRUAL_DATA_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Menstrual cycle data kaydedilirken hata:', error);
      throw error;
    }
  },

  // Cycle Records
  async getCycleRecords(): Promise<CycleRecord[]> {
    try {
      const data = await AsyncStorage.getItem(CYCLE_RECORDS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Cycle kayıtları yüklenirken hata:', error);
      return [];
    }
  },

  async saveCycleRecords(records: CycleRecord[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CYCLE_RECORDS_KEY, JSON.stringify(records));
    } catch (error) {
      console.error('Cycle kayıtları kaydedilirken hata:', error);
      throw error;
    }
  },

  async saveCycleRecord(record: CycleRecord): Promise<void> {
    try {
      const records = await this.getCycleRecords();
      const index = records.findIndex((r) => r.date === record.date);

      if (index >= 0) {
        records[index] = record;
      } else {
        records.push(record);
      }

      await this.saveCycleRecords(records);
    } catch (error) {
      console.error('Cycle kaydı kaydedilirken hata:', error);
      throw error;
    }
  },

  // Monthly Goals
  async getMonthlyGoals(): Promise<MonthlyGoal[]> {
    try {
      const data = await AsyncStorage.getItem(MONTHLY_GOALS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Aylık hedefler yüklenirken hata:', error);
      return [];
    }
  },

  async saveMonthlyGoals(goals: MonthlyGoal[]): Promise<void> {
    try {
      await AsyncStorage.setItem(MONTHLY_GOALS_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Aylık hedefler kaydedilirken hata:', error);
      throw error;
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        CYCLE_SETTINGS_KEY,
        MENSTRUAL_DATA_KEY,
        CYCLE_RECORDS_KEY,
        MONTHLY_GOALS_KEY,
      ]);
    } catch (error) {
      console.error('Cycle data silinirken hata:', error);
      throw error;
    }
  },
};

