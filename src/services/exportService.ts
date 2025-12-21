import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { Medication } from '../types/medication';
import { WaterReminder } from '../types/water';
import { DailyRecord } from '../types/daily';

interface ExportData {
  medications: Medication[];
  waterReminders: WaterReminder[];
  dailyRecords: DailyRecord[];
  exportDate: string;
  version: string;
}

export const exportService = {
  async exportData(
    medications: Medication[],
    waterReminders: WaterReminder[],
    dailyRecords: DailyRecord[]
  ): Promise<void> {
    try {
      const exportData: ExportData = {
        medications,
        waterReminders,
        dailyRecords,
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const fileName = `haapp-export-${new Date().toISOString().split('T')[0]}.json`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, jsonString);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Verileri Dışa Aktar',
        });
      } else {
        Alert.alert(
          'Başarılı',
          `Veriler dışa aktarıldı: ${fileName}`,
          [{ text: 'Tamam' }]
        );
      }
    } catch (error) {
      console.error('Veri dışa aktarma hatası:', error);
      Alert.alert('Hata', 'Veriler dışa aktarılırken bir hata oluştu.');
      throw error;
    }
  },
};

