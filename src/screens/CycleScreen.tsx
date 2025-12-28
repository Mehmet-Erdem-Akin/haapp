import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Switch,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCycle } from '../context/CycleContext';
import Header from '../components/v2/Header';
import { ActionIcons, TabIcons } from '../utils/icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const CycleScreen: React.FC = () => {
  const {
    settings,
    setSettings,
    menstrualData,
    setMenstrualData,
    monthlyGoals,
    addMonthlyGoal,
    updateMonthlyGoal,
    deleteMonthlyGoal,
    cycleRecords,
    addCycleRecord,
  } = useCycle();

  const [showSettings, setShowSettings] = useState(false);
  const [showMenstrualSetup, setShowMenstrualSetup] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  
  // Menstrual data form state
  const [lastPeriodDate, setLastPeriodDate] = useState(new Date());
  const [cycleLength, setCycleLength] = useState('28');
  const [periodLength, setPeriodLength] = useState('5');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Monthly goal form state
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [goalTarget, setGoalTarget] = useState('');

  useEffect(() => {
    if (menstrualData) {
      setLastPeriodDate(new Date(menstrualData.lastPeriodDate));
      setCycleLength(menstrualData.cycleLength.toString());
      setPeriodLength(menstrualData.periodLength.toString());
    }
  }, [menstrualData]);

  const handleToggleCycleType = async (cycleType: 'general' | 'menstrual') => {
    await setSettings({
      ...settings,
      cycleType,
      isActive: true,
    });
  };

  const handleSaveMenstrualData = async () => {
    if (!cycleLength || !periodLength) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    const cycleLengthNum = parseInt(cycleLength, 10);
    const periodLengthNum = parseInt(periodLength, 10);

    if (isNaN(cycleLengthNum) || cycleLengthNum < 20 || cycleLengthNum > 45) {
      Alert.alert('Hata', 'Döngü uzunluğu 20-45 gün arasında olmalıdır');
      return;
    }

    if (isNaN(periodLengthNum) || periodLengthNum < 1 || periodLengthNum > 10) {
      Alert.alert('Hata', 'Adet süresi 1-10 gün arasında olmalıdır');
      return;
    }

    const dateStr = lastPeriodDate.toISOString().split('T')[0];
    await setMenstrualData({
      lastPeriodDate: dateStr,
      cycleLength: cycleLengthNum,
      periodLength: periodLengthNum,
    });

    setShowMenstrualSetup(false);
    Alert.alert('Başarılı', 'Regl döngüsü bilgileri kaydedildi');
  };

  const handleAddMonthlyGoal = async () => {
    if (!goalTitle.trim()) {
      Alert.alert('Hata', 'Lütfen hedef başlığı girin');
      return;
    }

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM formatı

    await addMonthlyGoal({
      title: goalTitle.trim(),
      description: goalDescription.trim() || undefined,
      targetCount: goalTarget ? parseInt(goalTarget, 10) : undefined,
      currentCount: 0,
      completed: false,
      month: currentMonth,
    });

    setGoalTitle('');
    setGoalDescription('');
    setGoalTarget('');
    setShowAddGoal(false);
  };

  const handleDeleteGoal = (id: string) => {
    Alert.alert(
      'Hedefi Sil',
      'Bu hedefi silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => deleteMonthlyGoal(id),
        },
      ]
    );
  };

  const handleToggleGoalComplete = async (id: string) => {
    const goal = monthlyGoals.find((g) => g.id === id);
    if (goal) {
      await updateMonthlyGoal(id, { completed: !goal.completed });
    }
  };

  const calculateNextPeriod = () => {
    if (!menstrualData) return null;

    const lastPeriod = new Date(menstrualData.lastPeriodDate);
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(nextPeriod.getDate() + menstrualData.cycleLength);

    return nextPeriod;
  };

  const nextPeriod = calculateNextPeriod();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthGoals = monthlyGoals.filter((g) => g.month === currentMonth);

  return (
    <LinearGradient colors={['#E0E8FF', '#C0D1FF', '#A0B5FF']} className="flex-1" style={{ flex: 1 }}>
      <Header
        title="Döngü & Aylık Hedefler"
        icon={<TabIcons.Cycle size={24} color="#FFFFFF" />}
        rightAction={
          <TouchableOpacity
            onPress={() => setShowSettings(true)}
            className="p-2 rounded-lg"
            activeOpacity={0.7}
          >
            <ActionIcons.Settings size={20} color="#6B7280" />
          </TouchableOpacity>
        }
      />

      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        {/* Cycle Type Toggle */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-lg">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-lg font-semibold text-gray-800">Mod Tipi</Text>
              <Text className="text-sm text-gray-500">Genel aylık hedefler veya regl döngüsü takibi</Text>
            </View>
            <Switch
              value={settings.cycleType === 'menstrual'}
              onValueChange={(value) => handleToggleCycleType(value ? 'menstrual' : 'general')}
              trackColor={{ false: '#D1D5DB', true: '#002BE0' }}
              thumbColor="#FFFFFF"
            />
          </View>
          <Text className="text-sm text-gray-600">
            {settings.cycleType === 'menstrual' ? 'Regl Döngüsü Takibi Aktif' : 'Genel Aylık Hedefler Aktif'}
          </Text>
        </View>

        {/* Menstrual Cycle Section */}
        {settings.cycleType === 'menstrual' && (
          <>
            {!menstrualData ? (
              <TouchableOpacity
                onPress={() => setShowMenstrualSetup(true)}
                className="bg-white rounded-2xl p-4 mb-4 shadow-lg border-2 border-dashed border-gray-300"
              >
                <Text className="text-base font-semibold text-gray-800 text-center mb-1">
                  Regl Döngüsü Bilgilerini Ayarla
                </Text>
                <Text className="text-sm text-gray-500 text-center">
                  Tahminler için son adet tarihi ve döngü bilgilerinizi girin
                </Text>
              </TouchableOpacity>
            ) : (
              <View className="bg-white rounded-2xl p-4 mb-4 shadow-lg">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-lg font-semibold text-gray-800">Regl Döngüsü</Text>
                  <TouchableOpacity
                    onPress={() => setShowMenstrualSetup(true)}
                    className="p-2"
                  >
                    <ActionIcons.Edit size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                <View className="mb-2">
                  <Text className="text-sm text-gray-500">Son Adet Tarihi</Text>
                  <Text className="text-base font-semibold text-gray-800">
                    {new Date(menstrualData.lastPeriodDate).toLocaleDateString('tr-TR')}
                  </Text>
                </View>
                <View className="mb-2">
                  <Text className="text-sm text-gray-500">Döngü Uzunluğu</Text>
                  <Text className="text-base font-semibold text-gray-800">{menstrualData.cycleLength} gün</Text>
                </View>
                {nextPeriod && (
                  <View className="mt-3 pt-3 border-t border-gray-200">
                    <Text className="text-sm text-gray-500">Tahmini Sonraki Adet</Text>
                    <Text className="text-base font-semibold text-primary">
                      {nextPeriod.toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Menstrual Setup Modal */}
            {showMenstrualSetup && (
              <View className="bg-white rounded-2xl p-4 mb-4 shadow-lg">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-lg font-semibold text-gray-800">Regl Döngüsü Bilgileri</Text>
                  <TouchableOpacity onPress={() => setShowMenstrualSetup(false)}>
                    <ActionIcons.Cancel size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Son Adet Tarihi</Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    className="bg-gray-50 rounded-xl p-3 border border-gray-200"
                  >
                    <Text className="text-base text-gray-800">
                      {lastPeriodDate.toLocaleDateString('tr-TR')}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={lastPeriodDate}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(Platform.OS === 'ios');
                        if (selectedDate) {
                          setLastPeriodDate(selectedDate);
                        }
                      }}
                    />
                  )}
                </View>

                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Döngü Uzunluğu (gün)</Text>
                  <TextInput
                    className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-base text-gray-800"
                    value={cycleLength}
                    onChangeText={setCycleLength}
                    keyboardType="numeric"
                    placeholder="28"
                  />
                </View>

                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Adet Süresi (gün)</Text>
                  <TextInput
                    className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-base text-gray-800"
                    value={periodLength}
                    onChangeText={setPeriodLength}
                    keyboardType="numeric"
                    placeholder="5"
                  />
                </View>

                <TouchableOpacity
                  onPress={handleSaveMenstrualData}
                  className="bg-primary py-3 rounded-xl items-center"
                >
                  <Text className="text-white text-base font-semibold">Kaydet</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {/* Monthly Goals Section */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-lg">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-800">Bu Ayın Hedefleri</Text>
            <TouchableOpacity
              onPress={() => setShowAddGoal(true)}
              className="bg-primary px-4 py-2 rounded-xl"
            >
              <Text className="text-white text-sm font-semibold">+ Ekle</Text>
            </TouchableOpacity>
          </View>

          {currentMonthGoals.length === 0 ? (
            <Text className="text-sm text-gray-500 text-center py-4">
              Henüz hedef eklenmemiş
            </Text>
          ) : (
            <View className="gap-2">
              {currentMonthGoals.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  onPress={() => handleToggleGoalComplete(goal.id)}
                  className={`p-3 rounded-xl border-2 ${
                    goal.completed
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text
                        className={`text-base font-semibold ${
                          goal.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                        }`}
                      >
                        {goal.title}
                      </Text>
                      {goal.description && (
                        <Text className="text-sm text-gray-600 mt-1">{goal.description}</Text>
                      )}
                      {goal.targetCount !== undefined && (
                        <Text className="text-sm text-gray-500 mt-1">
                          {goal.currentCount || 0} / {goal.targetCount}
                        </Text>
                      )}
                    </View>
                    <View className="flex-row items-center gap-2">
                      <View
                        className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                          goal.completed
                            ? 'bg-primary border-primary'
                            : 'border-gray-300'
                        }`}
                      >
                        {goal.completed && <ActionIcons.Check size={16} color="#FFFFFF" />}
                      </View>
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          handleDeleteGoal(goal.id);
                        }}
                        className="p-1"
                      >
                        <ActionIcons.Delete size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Add Goal Modal */}
        {showAddGoal && (
          <View className="bg-white rounded-2xl p-4 mb-4 shadow-lg">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-800">Yeni Hedef</Text>
              <TouchableOpacity onPress={() => setShowAddGoal(false)}>
                <ActionIcons.Cancel size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Başlık *</Text>
              <TextInput
                className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-base text-gray-800"
                value={goalTitle}
                onChangeText={setGoalTitle}
                placeholder="Örn: 4 kitap oku"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Açıklama</Text>
              <TextInput
                className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-base text-gray-800"
                value={goalDescription}
                onChangeText={setGoalDescription}
                placeholder="Opsiyonel açıklama"
                multiline
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Hedef Sayı (opsiyonel)</Text>
              <TextInput
                className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-base text-gray-800"
                value={goalTarget}
                onChangeText={setGoalTarget}
                keyboardType="numeric"
                placeholder="Örn: 4"
              />
            </View>

            <TouchableOpacity
              onPress={handleAddMonthlyGoal}
              className="bg-primary py-3 rounded-xl items-center"
            >
              <Text className="text-white text-base font-semibold">Kaydet</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <View className="bg-white rounded-2xl p-4 mb-4 shadow-lg">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-800">Ayarlar</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <ActionIcons.Cancel size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-base text-gray-800">Döngü Takibi Aktif</Text>
              <Switch
                value={settings.isActive}
                onValueChange={(value) => setSettings({ ...settings, isActive: value })}
                trackColor={{ false: '#D1D5DB', true: '#002BE0' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default CycleScreen;

