import React from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useDaily } from '../context/DailyContext';
import { useMedications } from '../context/MedicationContext';
import { useWater } from '../context/WaterContext';
import { exportService } from '../services/exportService';
import { ActionIcons, StatusIcons, TabIcons, WaterIcons } from '../utils/icons';

const DailyScreen: React.FC = () => {
  const { getTodayRecord, getTotalWaterToday, records } = useDaily();
  const { medications } = useMedications();
  const { reminders } = useWater();
  const todayRecord = getTodayRecord();
  const totalWater = getTotalWaterToday();
  const totalLiters = (totalWater / 1000).toFixed(2);

  const takenMedications = todayRecord.medications.filter((m) => m.taken);
  const notTakenMedications = todayRecord.medications.filter((m) => !m.taken);
  const missedMedications = notTakenMedications.filter((m) => m.missed);
  const pendingMedications = notTakenMedications.filter((m) => !m.missed);

  const handleExport = async () => {
    try {
      await exportService.exportData(medications, reminders, records);
      Alert.alert('Başarılı', 'Veriler başarıyla dışa aktarıldı!');
    } catch (error) {
      Alert.alert('Hata', 'Veriler dışa aktarılırken bir hata oluştu.');
    }
  };

  return (
    <LinearGradient
      colors={['#E0E8FF', '#C0D1FF', '#A0B5FF']}
      className="flex-1"
      style={{ flex: 1 }}
    >
      <ScrollView className="flex-1" style={{ flex: 1 }}>
        <View 
          className="bg-white pt-5 pb-5 px-5 rounded-b-[20px] border border-gray-200 overflow-hidden flex-row justify-between items-center"
          style={{ shadowColor: '#002BE0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 }}
        >
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <TabIcons.Daily size={32} color="#002BE0" />
              <Text className="text-[32px] font-bold text-primary ml-2">Günlük Takip</Text>
            </View>
            <Text className="text-base text-gray-700">Bugünün Özeti</Text>
          </View>
          <TouchableOpacity
            onPress={handleExport}
            className="bg-primary rounded-[16px] px-4 py-2 flex-row items-center"
            activeOpacity={0.8}
            accessibilityLabel="Verileri dışa aktar"
            accessibilityRole="button"
          >
            <ActionIcons.Download size={16} color="#FFFFFF" />
            <Text className="text-white font-semibold text-sm ml-1.5">Export</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row p-4 gap-3">
          <View 
            className="flex-1 rounded-[20px] p-4 items-center border border-gray-300 overflow-hidden"
            style={{ 
              backgroundColor: '#FFFFFF',
              shadowColor: '#002BE0', 
              shadowOffset: { width: 0, height: 2 }, 
              shadowOpacity: 0.15, 
              shadowRadius: 8, 
              elevation: 3 
            }}
          >
            <Text className="text-2xl font-bold text-primary mb-1">{takenMedications.length}</Text>
            <Text className="text-xs text-gray-700 text-center">İçilen İlaç</Text>
          </View>
          <View 
            className="flex-1 rounded-[20px] p-4 items-center border border-gray-300 overflow-hidden"
            style={{ 
              backgroundColor: '#FFFFFF',
              shadowColor: '#002BE0', 
              shadowOffset: { width: 0, height: 2 }, 
              shadowOpacity: 0.15, 
              shadowRadius: 8, 
              elevation: 3 
            }}
          >
            <Text className="text-2xl font-bold text-primary mb-1">{pendingMedications.length}</Text>
            <Text className="text-xs text-gray-700 text-center">Bekleyen İlaç</Text>
          </View>
          <View 
            className="flex-1 rounded-[20px] p-4 items-center border border-gray-300 overflow-hidden"
            style={{ 
              backgroundColor: '#FFFFFF',
              shadowColor: '#002BE0', 
              shadowOffset: { width: 0, height: 2 }, 
              shadowOpacity: 0.15, 
              shadowRadius: 8, 
              elevation: 3 
            }}
          >
            <Text className="text-2xl font-bold text-primary mb-1">{totalLiters}L</Text>
            <Text className="text-xs text-gray-700 text-center">İçilen Su</Text>
          </View>
        </View>

      <View className="p-4 pt-0">
        <View className="flex-row items-center mb-3">
          <StatusIcons.Success size={20} color="#10B981" />
          <Text className="text-lg font-bold text-gray-900 ml-2">İçilen İlaçlar</Text>
        </View>
        {takenMedications.length === 0 ? (
          <View className="bg-white rounded-[20px] p-6 items-center border border-gray-300">
            <Text className="text-sm text-gray-700">Henüz ilaç içilmedi</Text>
          </View>
        ) : (
          <FlatList
            data={takenMedications}
            keyExtractor={(item) => item.medicationId}
            renderItem={({ item }) => (
              <View className="bg-white rounded-[20px] p-4 mb-2 flex-row justify-between items-center border border-gray-300 overflow-hidden"
                style={{ shadowColor: '#002BE0', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 }}
              >
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900 mb-1">{item.medicationName}</Text>
                  <View className="flex-row items-center mb-0.5">
                    <ActionIcons.Time size={14} color="#6B7280" />
                    <Text className="text-sm text-gray-700 ml-1">{item.time}</Text>
                  </View>
                  {item.takenAt && (
                    <Text className="text-xs text-primary mt-1">
                      İçildi: {new Date(item.takenAt).toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  )}
                </View>
                <View className="w-8 h-8 rounded-full bg-success-100 border border-success-400 justify-center items-center">
                  <ActionIcons.CheckCircle size={20} color="#10B981" />
                </View>
              </View>
            )}
            scrollEnabled={false}
          />
        )}
      </View>

      {missedMedications.length > 0 && (
        <View className="p-4 pt-0">
          <View className="flex-row items-center mb-3">
            <StatusIcons.Error size={20} color="#EF4444" />
            <Text className="text-lg font-bold text-gray-900 ml-2">İçilmeyen İlaçlar</Text>
          </View>
          <FlatList
            data={missedMedications}
            keyExtractor={(item) => item.medicationId}
            renderItem={({ item }) => (
              <View className="bg-red-50 rounded-[20px] p-4 mb-2 flex-row justify-between items-center border-l-4 border-l-red-400 border border-red-200 overflow-hidden"
                style={{ shadowColor: '#EF4444', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}
              >
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900 mb-1">{item.medicationName}</Text>
                  <View className="flex-row items-center mb-0.5">
                    <ActionIcons.Time size={14} color="#6B7280" />
                    <Text className="text-sm text-gray-700 ml-1">{item.time}</Text>
                  </View>
                </View>
                <View className="bg-red-100 border border-red-300 rounded-xl px-2 py-1">
                  <Text className="text-xs text-red-700 font-semibold">İçilmedi</Text>
                </View>
              </View>
            )}
            scrollEnabled={false}
          />
        </View>
      )}

      <View className="p-4 pt-0">
        <View className="flex-row items-center mb-3">
          <ActionIcons.Hourglass size={20} color="#F59E0B" />
          <Text className="text-lg font-bold text-gray-900 ml-2">Bekleyen İlaçlar</Text>
        </View>
        {pendingMedications.length === 0 ? (
          <View className="bg-white rounded-[20px] p-6 items-center border border-gray-300">
            <Text className="text-sm text-gray-700">Tüm ilaçlar içildi!</Text>
          </View>
        ) : (
          <FlatList
            data={pendingMedications}
            keyExtractor={(item) => item.medicationId}
            renderItem={({ item }) => (
              <View className="bg-yellow-50 rounded-[20px] p-4 mb-2 flex-row justify-between items-center border-l-4 border-l-yellow-400 border border-yellow-200 overflow-hidden"
                style={{ shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}
              >
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900 mb-1">{item.medicationName}</Text>
                  <View className="flex-row items-center mb-0.5">
                    <ActionIcons.Time size={14} color="#6B7280" />
                    <Text className="text-sm text-gray-700 ml-1">{item.time}</Text>
                  </View>
                </View>
                <View className="bg-yellow-100 border border-yellow-300 rounded-xl px-2 py-1">
                  <Text className="text-xs text-yellow-700 font-semibold">Bekliyor</Text>
                </View>
              </View>
            )}
            scrollEnabled={false}
          />
        )}
      </View>

      <View className="p-4 pt-0">
        <View className="flex-row items-center mb-3">
          <WaterIcons.Drop size={20} color="#002BE0" />
          <Text className="text-lg font-bold text-gray-900 ml-2">Su İçme Kayıtları</Text>
        </View>
        {todayRecord.water.length === 0 ? (
          <View className="bg-white rounded-[20px] p-6 items-center border border-gray-300">
            <Text className="text-sm text-gray-700">Henüz su içilmedi</Text>
          </View>
        ) : (
          <FlatList
            data={todayRecord.water}
            keyExtractor={(item, index) => `${item.time}-${index}`}
            renderItem={({ item }) => (
              <View className="bg-white rounded-[20px] p-4 mb-2 flex-row justify-between items-center border border-gray-300 overflow-hidden"
                style={{ shadowColor: '#002BE0', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 }}
              >
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900 mb-1">{item.amount}ml</Text>
                  <View className="flex-row items-center mb-0.5">
                    <ActionIcons.Time size={14} color="#6B7280" />
                    <Text className="text-sm text-gray-700 ml-1">{item.time}</Text>
                  </View>
                  <Text className="text-xs text-primary mt-1 font-semibold">
                    Toplam: {(item.totalAmount / 1000).toFixed(2)}L
                  </Text>
                </View>
              </View>
            )}
            scrollEnabled={false}
          />
        )}
      </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default DailyScreen;

