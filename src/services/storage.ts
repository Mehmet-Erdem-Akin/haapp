import AsyncStorage from '@react-native-async-storage/async-storage';
import { Medication } from '../types/medication';

const STORAGE_KEY = '@haapp_medications';

export const storageService = {
  // Tüm ilaçları getir
  async getMedications(): Promise<Medication[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('İlaçlar yüklenirken hata:', error);
      return [];
    }
  },

  // İlaçları kaydet
  async saveMedications(medications: Medication[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
    } catch (error) {
      console.error('İlaçlar kaydedilirken hata:', error);
      throw error;
    }
  },

  // Tüm ilaçları sil
  async clearMedications(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('İlaçlar silinirken hata:', error);
      throw error;
    }
  },
};



