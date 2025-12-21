import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useWater } from '../context/WaterContext';
import { useDaily } from '../context/DailyContext';
import { WaterReminder } from '../types/water';
import AddWaterReminderScreen from './AddWaterReminderScreen';
import WaterReminderItem from '../components/WaterReminderItem';

const WaterScreen: React.FC = () => {
  const { reminders, deleteReminder } = useWater();
  const { markWaterDrunk, getTotalWaterToday } = useDaily();
  const [showAddScreen, setShowAddScreen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<WaterReminder | null>(null);

  const totalWater = getTotalWaterToday();
  const totalLiters = (totalWater / 1000).toFixed(2);

  const handleAddPress = () => {
    setEditingReminder(null);
    setShowAddScreen(true);
  };

  const handleEditPress = (reminder: WaterReminder) => {
    setEditingReminder(reminder);
    setShowAddScreen(true);
  };

  const handleDeletePress = (reminder: WaterReminder) => {
    Alert.alert(
      'Hatırlatmayı Sil',
      `${reminder.amount}ml su hatırlatmasını silmek istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => deleteReminder(reminder.id),
        },
      ]
    );
  };

  const handleDrinkPress = async (amount: number) => {
    try {
      await markWaterDrunk(amount);
      Alert.alert('Başarılı', `${amount}ml su içildi olarak kaydedildi.`);
    } catch (error) {
      Alert.alert('Hata', 'Su kaydı güncellenirken bir hata oluştu.');
    }
  };

  const handleQuickDrink = (amount: number) => {
    Alert.alert(
      'Su İç',
      `${amount}ml su içtiniz mi?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Evet',
          onPress: () => handleDrinkPress(amount),
        },
      ]
    );
  };

  const handleCloseAddScreen = () => {
    setShowAddScreen(false);
    setEditingReminder(null);
  };

  if (showAddScreen) {
    return (
      <AddWaterReminderScreen
        reminder={editingReminder}
        onClose={handleCloseAddScreen}
      />
    );
  }

  return (
    <LinearGradient
      colors={['#E0E8FF', '#C0D1FF', '#A0B5FF']}
      className="flex-1"
      style={{ flex: 1 }}
    >
      <View 
        className="bg-white pt-5 pb-5 px-5 rounded-b-[20px] border border-gray-200 overflow-hidden"
        style={{ shadowColor: '#002BE0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 }}
      >
        <Text className="text-[32px] font-bold text-primary mb-1">💧 Su İçme</Text>
        <Text className="text-base text-gray-700">Günlük Su Takibi</Text>
      </View>

      <View className="flex-row p-4 gap-3">
        <BlurView 
          intensity={15} 
          className="flex-1 bg-white rounded-[20px] p-4 items-center border border-gray-300 overflow-hidden"
          style={{ shadowColor: '#002BE0', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 }}
        >
          <Text className="text-[28px] font-bold text-primary mb-1">{totalLiters}L</Text>
          <Text className="text-sm text-gray-700">Bugün İçilen</Text>
        </BlurView>
        <BlurView 
          intensity={15} 
          className="flex-1 bg-white rounded-[20px] p-4 items-center border border-gray-300 overflow-hidden"
          style={{ shadowColor: '#002BE0', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 }}
        >
          <Text className="text-[28px] font-bold text-primary mb-1">{reminders.length}</Text>
          <Text className="text-sm text-gray-700">Hatırlatma</Text>
        </BlurView>
      </View>

      <View className="px-4 pb-4">
        <Text className="text-base font-semibold text-gray-900 mb-3">Hızlı Ekle</Text>
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => handleQuickDrink(250)}
            className="flex-1 rounded-2xl overflow-hidden"
            activeOpacity={0.8}
            style={{ shadowColor: '#002BE0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 }}
          >
            <View className="rounded-2xl py-3 items-center bg-primary">
              <Text className="text-base font-semibold text-white">250ml</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleQuickDrink(500)}
            className="flex-1 rounded-2xl overflow-hidden"
            activeOpacity={0.8}
            style={{ shadowColor: '#002BE0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 }}
          >
            <View className="rounded-2xl py-3 items-center bg-primary">
              <Text className="text-base font-semibold text-white">500ml</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleQuickDrink(750)}
            className="flex-1 rounded-2xl overflow-hidden"
            activeOpacity={0.8}
            style={{ shadowColor: '#002BE0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 }}
          >
            <View className="rounded-2xl py-3 items-center bg-primary">
              <Text className="text-base font-semibold text-white">750ml</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {reminders.length === 0 ? (
        <View className="flex-1 justify-center items-center px-10">
          <Text className="text-xl font-semibold text-primary mb-2 text-center">Henüz hatırlatma eklenmemiş</Text>
          <Text className="text-sm text-gray-700 text-center">
            Sağ alttaki butona tıklayarak hatırlatma ekleyebilirsiniz
          </Text>
        </View>
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WaterReminderItem
              reminder={item}
              onEdit={() => handleEditPress(item)}
              onDelete={() => handleDeletePress(item)}
            />
          )}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16 }}
        />
      )}

      <TouchableOpacity
        className="absolute right-5 bottom-5 w-[64px] h-[64px] rounded-[32px] bg-primary justify-center items-center"
        onPress={handleAddPress}
        activeOpacity={0.8}
        accessibilityLabel="Yeni hatırlatma ekle"
        accessibilityRole="button"
        style={{ shadowColor: '#002BE0', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 }}
      >
        <Text className="text-[36px] text-white font-light" style={{ textAlign: 'center', lineHeight: 36 }}>+</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default WaterScreen;

