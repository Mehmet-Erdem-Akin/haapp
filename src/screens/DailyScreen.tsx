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
import { useDaily } from '../context/DailyContext';
import { useMedications } from '../context/MedicationContext';
import { useWater } from '../context/WaterContext';
import { exportService } from '../services/exportService';
import Header from '../components/v2/Header';
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
      colors={['#F8FAFC', '#F1F5F9']}
      style={{ flex: 1 }}
    >
      {/* Header */}
      <Header
        title="Günlük Takip"
        subtitle="Bugünün Özeti"
        icon={<TabIcons.Daily size={24} color="#FFFFFF" />}
        iconGradient={['#10B981', '#34D399']}
        rightAction={{
          icon: <ActionIcons.Download size={20} color="#6B7280" />,
          onPress: handleExport,
        }}
      />

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
        {/* Stats Cards */}
        <View className="flex-row gap-3 mb-6">
          <View 
            className="flex-1 rounded-2xl p-4 items-center border border-gray-200 overflow-hidden bg-white"
            style={{ 
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text className="text-2xl font-bold text-gray-900 mb-1">{takenMedications.length}</Text>
            <Text className="text-xs text-gray-600 text-center">İçilen İlaç</Text>
          </View>
          <View 
            className="flex-1 rounded-2xl p-4 items-center border border-gray-200 overflow-hidden bg-white"
            style={{ 
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text className="text-2xl font-bold text-gray-900 mb-1">{pendingMedications.length}</Text>
            <Text className="text-xs text-gray-600 text-center">Bekleyen İlaç</Text>
          </View>
          <View 
            className="flex-1 rounded-2xl p-4 items-center border border-gray-200 overflow-hidden bg-white"
            style={{ 
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text className="text-2xl font-bold text-gray-900 mb-1">{totalLiters}L</Text>
            <Text className="text-xs text-gray-600 text-center">İçilen Su</Text>
          </View>
        </View>

        {/* İçilen İlaçlar */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <StatusIcons.Success size={20} color="#10B981" />
            <Text className="text-lg font-bold text-gray-900 ml-2">İçilen İlaçlar</Text>
          </View>
          {takenMedications.length === 0 ? (
            <View className="bg-white rounded-2xl p-6 items-center border border-gray-200"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text className="text-sm text-gray-600">Henüz ilaç içilmedi</Text>
            </View>
          ) : (
            <View className="gap-2">
              {takenMedications.map((item) => (
                <View
                  key={item.medicationId}
                  className="bg-white rounded-2xl p-4 flex-row justify-between items-center border border-gray-200 overflow-hidden"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900 mb-1">{item.medicationName}</Text>
                    <View className="flex-row items-center mb-0.5">
                      <ActionIcons.Time size={14} color="#6B7280" />
                      <Text className="text-sm text-gray-700 ml-1">{item.time}</Text>
                    </View>
                    {item.takenAt && (
                      <Text className="text-xs text-blue-600 mt-1">
                        İçildi: {new Date(item.takenAt).toLocaleTimeString('tr-TR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    )}
                  </View>
                  <View className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-400 justify-center items-center">
                    <ActionIcons.CheckCircle size={20} color="#10B981" />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* İçilmeyen İlaçlar */}
        {missedMedications.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <StatusIcons.Error size={20} color="#EF4444" />
              <Text className="text-lg font-bold text-gray-900 ml-2">İçilmeyen İlaçlar</Text>
            </View>
            <View className="gap-2">
              {missedMedications.map((item) => (
                <View
                  key={item.medicationId}
                  className="bg-red-50 rounded-2xl p-4 flex-row justify-between items-center border-l-4 border-l-red-400 border border-red-200 overflow-hidden"
                  style={{
                    shadowColor: '#EF4444',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
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
              ))}
            </View>
          </View>
        )}

        {/* Bekleyen İlaçlar */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <ActionIcons.Hourglass size={20} color="#F59E0B" />
            <Text className="text-lg font-bold text-gray-900 ml-2">Bekleyen İlaçlar</Text>
          </View>
          {pendingMedications.length === 0 ? (
            <View className="bg-white rounded-2xl p-6 items-center border border-gray-200"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text className="text-sm text-gray-600">Tüm ilaçlar içildi!</Text>
            </View>
          ) : (
            <View className="gap-2">
              {pendingMedications.map((item) => (
                <View
                  key={item.medicationId}
                  className="bg-yellow-50 rounded-2xl p-4 flex-row justify-between items-center border-l-4 border-l-yellow-400 border border-yellow-200 overflow-hidden"
                  style={{
                    shadowColor: '#F59E0B',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
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
              ))}
            </View>
          )}
        </View>

        {/* Su İçme Kayıtları */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <WaterIcons.Drop size={20} color="#3B82F6" />
            <Text className="text-lg font-bold text-gray-900 ml-2">Su İçme Kayıtları</Text>
          </View>
          {todayRecord.water.length === 0 ? (
            <View className="bg-white rounded-2xl p-6 items-center border border-gray-200"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text className="text-sm text-gray-600">Henüz su içilmedi</Text>
            </View>
          ) : (
            <View className="gap-2">
              {todayRecord.water.map((item, index) => (
                <View
                  key={`${item.time}-${index}`}
                  className="bg-white rounded-2xl p-4 flex-row justify-between items-center border border-gray-200 overflow-hidden"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900 mb-1">{item.amount}ml</Text>
                    <View className="flex-row items-center mb-0.5">
                      <ActionIcons.Time size={14} color="#6B7280" />
                      <Text className="text-sm text-gray-700 ml-1">{item.time}</Text>
                    </View>
                    <Text className="text-xs text-blue-600 mt-1 font-semibold">
                      Toplam: {(item.totalAmount / 1000).toFixed(2)}L
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default DailyScreen;

