import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useWater } from '../context/WaterContext';
import { useDaily } from '../context/DailyContext';
import { WaterReminder } from '../types/water';
import AddWaterReminderScreen from './AddWaterReminderScreen';
import CircularProgress from '../components/v2/CircularProgress';
import QuickActions from '../components/v2/QuickActions';
import DailyStats from '../components/v2/DailyStats';
import WeeklyChart from '../components/v2/WeeklyChart';
import { WaterIcons } from '../utils/icons';

const WaterScreen: React.FC = () => {
  const { reminders } = useWater();
  const { markWaterDrunk, getTotalWaterToday, getTodayRecord, records } = useDaily();
  const [showAddScreen, setShowAddScreen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<WaterReminder | null>(null);

  const dailyGoal = 2500; // ml
  const totalWater = getTotalWaterToday();
  const percentage = Math.min((totalWater / dailyGoal) * 100, 100);
  const todayRecord = getTodayRecord();
  
  // Haftalık veri hesapla
  const weeklyData = useMemo(() => {
    const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const record = records.find(r => r.date === dateStr);
      
      const total = record?.water.reduce((sum, w) => sum + w.amount, 0) || 0;
      
      data.push({
        day: days[date.getDay() === 0 ? 6 : date.getDay() - 1],
        amount: total,
      });
    }
    
    return data;
  }, [records]);

  const handleAddPress = () => {
    setEditingReminder(null);
    setShowAddScreen(true);
  };

  const handleAddWater = async (amount: number) => {
    try {
      await markWaterDrunk(amount);
    } catch (error) {
      Alert.alert('Hata', 'Su kaydı güncellenirken bir hata oluştu.');
    }
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

  // Bugünkü girişleri sırala (en yeni önce)
  const todayEntries = [...todayRecord.water].reverse();

  return (
    <LinearGradient
      colors={['#F8FAFC', '#F1F5F9']}
      style={{ flex: 1 }}
    >
      {/* Header */}
      <View 
        className="bg-white"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View className="px-6 py-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <LinearGradient
              colors={['#3B82F6', '#06B6D4']}
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}
            >
              <WaterIcons.Drop size={24} color="#FFFFFF" />
            </LinearGradient>
            <View>
              <Text className="font-bold text-gray-900 text-lg">Aqua</Text>
              <Text className="text-xs text-gray-500">Su Takip</Text>
            </View>
            </View>
          <TouchableOpacity
            onPress={handleAddPress}
            className="p-2 rounded-lg"
            activeOpacity={0.7}
          >
            <WaterIcons.Drop size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
        {/* Circular Progress */}
        <CircularProgress 
          percentage={percentage}
          totalToday={totalWater}
          dailyGoal={dailyGoal}
        />

        {/* Quick Actions */}
        <QuickActions onAddWater={handleAddWater} />

        {/* Daily Stats */}
        <DailyStats 
          entries={todayEntries}
          totalToday={totalWater}
          dailyGoal={dailyGoal}
        />

        {/* Weekly Chart */}
        <WeeklyChart data={weeklyData} dailyGoal={dailyGoal} />
      </ScrollView>
    </LinearGradient>
  );
};

export default WaterScreen;

