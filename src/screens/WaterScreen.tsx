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
import Header from '../components/v2/Header';
import CircularProgress from '../components/v2/CircularProgress';
import QuickActions from '../components/v2/QuickActions';
import DailyStats from '../components/v2/DailyStats';
import WeeklyChart from '../components/v2/WeeklyChart';
import WaterEntriesList from '../components/v2/WaterEntriesList';
import WaterGoalModal from '../components/v2/WaterGoalModal';
import { WaterIcons, ActionIcons } from '../utils/icons';

const WaterScreen: React.FC = () => {
  const { reminders, waterGoal, setWaterGoal } = useWater();
  const { markWaterDrunk, removeWaterEntry, getTotalWaterToday, getTodayRecord, records } = useDaily();
  const [showAddScreen, setShowAddScreen] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<WaterReminder | null>(null);

  const totalWater = getTotalWaterToday();
  const percentage = Math.min((totalWater / waterGoal) * 100, 100);
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

  const handleDeleteWater = async (time: string) => {
    Alert.alert(
      'Su Kaydını Sil',
      'Bu su kaydını silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeWaterEntry(time);
            } catch (error) {
              Alert.alert('Hata', 'Su kaydı silinirken bir hata oluştu.');
            }
          },
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

  // Bugünkü girişleri WaterEntriesList'te sıralanıyor
  const todayEntries = [...todayRecord.water];

  return (
    <LinearGradient
      colors={['#F8FAFC', '#F1F5F9']}
      style={{ flex: 1 }}
    >
      {/* Header */}
      <Header
        title="Aqua"
        subtitle="Su Takip"
        icon={<WaterIcons.Drop size={24} color="#FFFFFF" />}
        iconGradient={['#3B82F6', '#06B6D4']}
        rightAction={{
          icon: <ActionIcons.Add size={20} color="#6B7280" />,
          onPress: handleAddPress,
        }}
      />

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
        {/* Circular Progress */}
        <CircularProgress 
          percentage={percentage}
          totalToday={totalWater}
          total={waterGoal}
          icon={<WaterIcons.Drop size={32} color="#3B82F6" />}
          unit="ml"
          gradientColors={['#3B82F6', '#06B6D4']}
          onPress={() => setShowGoalModal(true)}
          successMessage="Günlük hedefinizin tamamlandı"
          defaultMessage="Günlük hedefiniz"
        />

        {/* Quick Actions */}
        <QuickActions onAddWater={handleAddWater} />

        {/* Daily Stats */}
        <DailyStats 
          entries={todayEntries}
          totalToday={totalWater}
          dailyGoal={waterGoal}
        />

        {/* Water Entries List */}
        <WaterEntriesList 
          entries={todayEntries}
          onDelete={handleDeleteWater}
        />

        {/* Weekly Chart */}
        <WeeklyChart data={weeklyData} dailyGoal={waterGoal} />
      </ScrollView>

      {/* Water Goal Modal */}
      <WaterGoalModal
        visible={showGoalModal}
        currentGoal={waterGoal}
        onClose={() => setShowGoalModal(false)}
        onSave={setWaterGoal}
      />
    </LinearGradient>
  );
};

export default WaterScreen;

