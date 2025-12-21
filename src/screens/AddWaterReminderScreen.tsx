import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useWater } from '../context/WaterContext';
import { WaterReminder } from '../types/water';

interface AddWaterReminderScreenProps {
  reminder: WaterReminder | null;
  onClose: () => void;
}

const AddWaterReminderScreen: React.FC<AddWaterReminderScreenProps> = ({
  reminder,
  onClose,
}) => {
  const { addReminder, updateReminder, addBulkReminders } = useWater();
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [amount, setAmount] = useState('');
  const [time, setTime] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [intervalHours, setIntervalHours] = useState(2);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  useEffect(() => {
    if (reminder) {
      setAmount(reminder.amount.toString());
      const [hours, minutes] = reminder.time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setTime(date);
      setIsBulkMode(false);
    } else {
      // Default times for bulk mode
      const now = new Date();
      const start = new Date();
      start.setHours(8, 0, 0, 0);
      const end = new Date();
      end.setHours(22, 0, 0, 0);
      setStartTime(start);
      setEndTime(end);
    }
  }, [reminder]);

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const handleStartTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartTimePicker(false);
    }
    if (selectedTime) {
      setStartTime(selectedTime);
    }
  };

  const handleEndTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowEndTimePicker(false);
    }
    if (selectedTime) {
      setEndTime(selectedTime);
    }
  };

  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const generateTimeSlots = (start: Date, end: Date, intervalHours: number): string[] => {
    const slots: string[] = [];
    const current = new Date(start);
    
    while (current <= end) {
      const hours = current.getHours().toString().padStart(2, '0');
      const minutes = current.getMinutes().toString().padStart(2, '0');
      slots.push(`${hours}:${minutes}`);
      
      current.setHours(current.getHours() + intervalHours);
    }
    
    return slots;
  };

  const handleSave = async () => {
    const amountNum = parseInt(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir miktar giriniz (ml).');
      return;
    }

    try {
      if (isBulkMode) {
        // Validate bulk mode inputs
        if (startTime >= endTime) {
          Alert.alert('Hata', 'Başlangıç saati bitiş saatinden önce olmalıdır.');
          return;
        }

        const timeSlots = generateTimeSlots(startTime, endTime, intervalHours);
        
        if (timeSlots.length === 0) {
          Alert.alert('Hata', 'Seçilen aralıkta hatırlatma oluşturulamadı.');
          return;
        }

        const remindersData = timeSlots.map((time) => ({
          time,
          amount: amountNum,
        }));

        await addBulkReminders(remindersData);

        Alert.alert(
          'Başarılı',
          `${timeSlots.length} adet hatırlatma oluşturuldu!`,
          [{ text: 'Tamam', onPress: onClose }]
        );
      } else {
        // Single reminder mode
        const timeString = formatTime(time);
        const reminderData = {
          time: timeString,
          amount: amountNum,
        };

        if (reminder) {
          await updateReminder(reminder.id, reminderData);
        } else {
          await addReminder(reminderData);
        }

        Alert.alert('Başarılı', 'Hatırlatma kaydedildi!', [
          { text: 'Tamam', onPress: onClose },
        ]);
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Hatırlatma kaydedilirken bir hata oluştu.';
      Alert.alert('Hata', errorMessage);
      console.error('Hatırlatma kaydetme hatası:', error);
    }
  };

  return (
    <LinearGradient
      colors={['#E0E8FF', '#C0D1FF', '#A0B5FF']}
      className="flex-1"
      style={{ flex: 1 }}
    >
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 20, flexGrow: 1 }}
      >
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-gray-800">
            {reminder ? 'Hatırlatmayı Düzenle' : 'Yeni Su Hatırlatması'}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="w-10 h-10 rounded-[20px] justify-center items-center bg-gray-100 border border-gray-300"
            activeOpacity={0.7}
            accessibilityLabel="Kapat"
            accessibilityRole="button"
          >
            <Text className="text-lg text-gray-600 font-semibold">✕</Text>
          </TouchableOpacity>
        </View>

      <View style={{ gap: 20 }}>
        {!reminder && (
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-base font-semibold text-gray-700">Hatırlatma Tipi</Text>
              <View className="flex-row bg-gray-100 rounded-[12px] p-1">
                <TouchableOpacity
                  onPress={() => setIsBulkMode(false)}
                  className={`px-4 py-2 rounded-[10px] ${!isBulkMode ? 'bg-primary' : ''}`}
                  activeOpacity={0.7}
                >
                  <Text className={`text-sm font-semibold ${!isBulkMode ? 'text-white' : 'text-gray-600'}`}>
                    Tek
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsBulkMode(true)}
                  className={`px-4 py-2 rounded-[10px] ${isBulkMode ? 'bg-primary' : ''}`}
                  activeOpacity={0.7}
                >
                  <Text className={`text-sm font-semibold ${isBulkMode ? 'text-white' : 'text-gray-600'}`}>
                    Toplu
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-700 mb-2">Miktar (ml) *</Text>
          <TextInput
            className="bg-white rounded-[16px] p-4 text-base text-gray-800 border border-gray-300"
            value={amount}
            onChangeText={setAmount}
            placeholder="Örn: 250"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            accessibilityLabel="Su miktarı"
            style={{ shadowColor: '#002BE0', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}
          />
        </View>

        {isBulkMode && !reminder ? (
          <>
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-700 mb-2">Başlangıç Saati *</Text>
              <TouchableOpacity
                className="bg-white rounded-[16px] p-4 border border-gray-300"
                onPress={() => setShowStartTimePicker(true)}
                activeOpacity={0.7}
                accessibilityLabel="Başlangıç saati seç"
                accessibilityRole="button"
                style={{ shadowColor: '#002BE0', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}
              >
                <Text className="text-lg font-semibold text-primary">{formatTime(startTime)}</Text>
              </TouchableOpacity>

              {showStartTimePicker && (
                <DateTimePicker
                  value={startTime}
                  mode="time"
                  is24Hour={true}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleStartTimeChange}
                />
              )}
            </View>

            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-700 mb-2">Bitiş Saati *</Text>
              <TouchableOpacity
                className="bg-white rounded-[16px] p-4 border border-gray-300"
                onPress={() => setShowEndTimePicker(true)}
                activeOpacity={0.7}
                accessibilityLabel="Bitiş saati seç"
                accessibilityRole="button"
                style={{ shadowColor: '#002BE0', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}
              >
                <Text className="text-lg font-semibold text-primary">{formatTime(endTime)}</Text>
              </TouchableOpacity>

              {showEndTimePicker && (
                <DateTimePicker
                  value={endTime}
                  mode="time"
                  is24Hour={true}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleEndTimeChange}
                />
              )}
            </View>

            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-700 mb-2">Aralık (Saat) *</Text>
              <View className="flex-row gap-2">
                {[1, 2, 3, 4].map((hours) => (
                  <TouchableOpacity
                    key={hours}
                    onPress={() => setIntervalHours(hours)}
                    className={`flex-1 py-3 rounded-[12px] border-2 items-center ${
                      intervalHours === hours
                        ? 'bg-primary border-primary'
                        : 'bg-white border-gray-300'
                    }`}
                    activeOpacity={0.7}
                    accessibilityLabel={`${hours} saat aralık`}
                    accessibilityRole="button"
                    style={{ shadowColor: '#002BE0', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}
                  >
                    <Text
                      className={`text-base font-semibold ${
                        intervalHours === hours ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      {hours} saat
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {startTime < endTime && (
                <View className="mt-2">
                  <Text className="text-sm text-gray-500">
                    {generateTimeSlots(startTime, endTime, intervalHours).length} adet hatırlatma oluşturulacak
                  </Text>
                </View>
              )}
            </View>
          </>
        ) : (
          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-700 mb-2">Hatırlatma Saati *</Text>
            <TouchableOpacity
              className="bg-white rounded-[16px] p-4 border border-gray-300"
              onPress={() => setShowTimePicker(true)}
              activeOpacity={0.7}
              accessibilityLabel="Saat seç"
              accessibilityRole="button"
              style={{ shadowColor: '#002BE0', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}
            >
              <Text className="text-lg font-semibold text-primary">{formatTime(time)}</Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
              />
            )}
          </View>
        )}

        <TouchableOpacity
          className="rounded-[20px] mt-2 bg-primary py-4 items-center"
          onPress={handleSave}
          activeOpacity={0.8}
          accessibilityLabel="Kaydet"
          accessibilityRole="button"
          style={{ shadowColor: '#002BE0', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5 }}
        >
          <Text className="text-lg font-bold text-white">Kaydet</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default AddWaterReminderScreen;

