import AsyncStorage from '@react-native-async-storage/async-storage';

const WATER_GOAL_KEY = '@haapp_water_goal';

export const settingsStorageService = {
  async getWaterGoal(): Promise<number> {
    try {
      const data = await AsyncStorage.getItem(WATER_GOAL_KEY);
      return data ? parseInt(data, 10) : 2500; // Default 2500ml
    } catch (error) {
      console.error('Su hedefi yüklenirken hata:', error);
      return 2500;
    }
  },

  async saveWaterGoal(goal: number): Promise<void> {
    try {
      await AsyncStorage.setItem(WATER_GOAL_KEY, goal.toString());
    } catch (error) {
      console.error('Su hedefi kaydedilirken hata:', error);
      throw error;
    }
  },
};

