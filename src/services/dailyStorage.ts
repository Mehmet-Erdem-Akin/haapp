import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyRecord } from '../types/daily';

const STORAGE_KEY = '@haapp_daily_records';

export const getTodayDate = (): string => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

export const dailyStorageService = {
    async getRecords(): Promise<DailyRecord[]> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Günlük kayıtlar yüklenirken hata:', error);
            return [];
        }
    },

    async getTodayRecord(): Promise<DailyRecord | null> {
        try {
            const records = await this.getRecords();
            const today = getTodayDate();
            return records.find((r) => r.date === today) || null;
        } catch (error) {
            console.error('Bugünün kaydı yüklenirken hata:', error);
            return null;
        }
    },

    async saveRecord(record: DailyRecord): Promise<void> {
        try {
            const records = await this.getRecords();
            const index = records.findIndex((r) => r.date === record.date);

            if (index >= 0) {
                records[index] = record;
            } else {
                records.push(record);
            }

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        } catch (error) {
            console.error('Günlük kayıt kaydedilirken hata:', error);
            throw error;
        }
    },

    async clearRecords(): Promise<void> {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Günlük kayıtlar silinirken hata:', error);
            throw error;
        }
    },
};

