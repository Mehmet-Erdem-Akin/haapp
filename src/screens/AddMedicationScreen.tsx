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
import { BlurView } from 'expo-blur';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMedications } from '../context/MedicationContext';
import { Medication, ScheduleType } from '../types/medication';

interface AddMedicationScreenProps {
  medication: Medication | null;
  onClose: () => void;
}

const AddMedicationScreen: React.FC<AddMedicationScreenProps> = ({
  medication,
  onClose,
}) => {
  const { addMedication, updateMedication } = useMedications();
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [scheduleType, setScheduleType] = useState<ScheduleType>('daily');
  const [intervalDays, setIntervalDays] = useState('2');
  
  // Sabah/Akşam için
  const [morningTime, setMorningTime] = useState(new Date());
  const [eveningTime, setEveningTime] = useState(new Date());
  const [showMorningTimePicker, setShowMorningTimePicker] = useState(false);
  const [showEveningTimePicker, setShowEveningTimePicker] = useState(false);
  
  // Haftalık için
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const weekDays = [
    { key: 'Monday', label: 'Pazartesi' },
    { key: 'Tuesday', label: 'Salı' },
    { key: 'Wednesday', label: 'Çarşamba' },
    { key: 'Thursday', label: 'Perşembe' },
    { key: 'Friday', label: 'Cuma' },
    { key: 'Saturday', label: 'Cumartesi' },
    { key: 'Sunday', label: 'Pazar' },
  ];

  useEffect(() => {
    if (medication) {
      setName(medication.name);
      setDosage(medication.dosage);
      const [hours, minutes] = medication.time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setTime(date);
      
      setScheduleType(medication.scheduleType || 'daily');
      
      if (medication.intervalDays) {
        setIntervalDays(medication.intervalDays.toString());
      }
      
      if (medication.times && medication.times.length >= 2) {
        const [morningHours, morningMinutes] = medication.times[0].split(':');
        const morningDate = new Date();
        morningDate.setHours(parseInt(morningHours), parseInt(morningMinutes), 0, 0);
        setMorningTime(morningDate);
        
        const [eveningHours, eveningMinutes] = medication.times[1].split(':');
        const eveningDate = new Date();
        eveningDate.setHours(parseInt(eveningHours), parseInt(eveningMinutes), 0, 0);
        setEveningTime(eveningDate);
      }
      
      if (medication.days && Array.isArray(medication.days) && medication.days.length > 0) {
        setSelectedDays(medication.days);
      }
    }
  }, [medication]);

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const handleMorningTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowMorningTimePicker(false);
    }
    if (selectedTime) {
      setMorningTime(selectedTime);
    }
  };

  const handleEveningTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowEveningTimePicker(false);
    }
    if (selectedTime) {
      setEveningTime(selectedTime);
    }
  };

  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const toggleDay = (dayKey: string) => {
    if (selectedDays.includes(dayKey)) {
      setSelectedDays(selectedDays.filter(d => d !== dayKey));
    } else {
      setSelectedDays([...selectedDays, dayKey]);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Hata', 'Lütfen ilaç adını giriniz.');
      return;
    }
    if (!dosage.trim()) {
      Alert.alert('Hata', 'Lütfen dozaj bilgisini giriniz.');
      return;
    }

    try {
      let timeString = formatTime(time);
      let times: string[] | undefined;
      let days: 'everyday' | string[] = 'everyday';

      if (scheduleType === 'morningEvening') {
        times = [formatTime(morningTime), formatTime(eveningTime)];
        timeString = times[0]; // Ana saat olarak sabahı kullan
      } else if (scheduleType === 'weekly') {
        if (selectedDays.length === 0) {
          Alert.alert('Hata', 'Lütfen en az bir gün seçiniz.');
          return;
        }
        days = selectedDays;
      } else if (scheduleType === 'everyXDays') {
        const interval = parseInt(intervalDays, 10);
        if (isNaN(interval) || interval < 2) {
          Alert.alert('Hata', 'Aralık en az 2 gün olmalıdır.');
          return;
        }
      }

      const medicationData: Omit<Medication, 'id' | 'notificationId'> = {
        name: name.trim(),
        dosage: dosage.trim(),
        time: timeString,
        scheduleType,
        days,
        ...(times && { times }),
        ...(scheduleType === 'everyXDays' && { intervalDays: parseInt(intervalDays, 10) }),
      };

      if (medication) {
        await updateMedication(medication.id, medicationData);
      } else {
        await addMedication(medicationData);
      }

      Alert.alert('Başarılı', 'İlaç kaydedildi!', [
        { text: 'Tamam', onPress: onClose },
      ]);
    } catch (error: any) {
      const errorMessage = error?.message || 'İlaç kaydedilirken bir hata oluştu.';
      Alert.alert('Hata', errorMessage);
      console.error('İlaç kaydetme hatası:', error);
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
            {medication ? 'İlacı Düzenle' : 'Yeni İlaç Ekle'}
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
        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-700 mb-2">İlaç Adı *</Text>
          <TextInput
            className="bg-white rounded-[16px] p-4 text-base text-gray-800 border border-gray-300"
            value={name}
            onChangeText={setName}
            placeholder="Örn: Concor"
            placeholderTextColor="#9CA3AF"
            accessibilityLabel="İlaç adı"
            style={{ shadowColor: '#002BE0', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}
          />
        </View>

        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-700 mb-2">Dozaj *</Text>
          <TextInput
            className="bg-white rounded-[16px] p-4 text-base text-gray-800 border border-gray-300"
            value={dosage}
            onChangeText={setDosage}
            placeholder="Örn: 5mg"
            placeholderTextColor="#9CA3AF"
            accessibilityLabel="Dozaj"
            style={{ shadowColor: '#002BE0', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}
          />
        </View>

        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-700 mb-2">Zamanlama Tipi *</Text>
          <View className="flex-row flex-wrap gap-2">
            <TouchableOpacity
              onPress={() => setScheduleType('daily')}
              className={`px-4 py-2 rounded-xl border ${
                scheduleType === 'daily' ? 'bg-blue-500 border-blue-600' : 'bg-white border-gray-300'
              }`}
              activeOpacity={0.7}
            >
              <Text className={`text-sm font-semibold ${scheduleType === 'daily' ? 'text-white' : 'text-gray-700'}`}>
                Günlük
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setScheduleType('everyXDays')}
              className={`px-4 py-2 rounded-xl border ${
                scheduleType === 'everyXDays' ? 'bg-blue-500 border-blue-600' : 'bg-white border-gray-300'
              }`}
              activeOpacity={0.7}
            >
              <Text className={`text-sm font-semibold ${scheduleType === 'everyXDays' ? 'text-white' : 'text-gray-700'}`}>
                2 Günde Bir
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setScheduleType('morningEvening')}
              className={`px-4 py-2 rounded-xl border ${
                scheduleType === 'morningEvening' ? 'bg-blue-500 border-blue-600' : 'bg-white border-gray-300'
              }`}
              activeOpacity={0.7}
            >
              <Text className={`text-sm font-semibold ${scheduleType === 'morningEvening' ? 'text-white' : 'text-gray-700'}`}>
                Sabah/Akşam
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setScheduleType('weekly')}
              className={`px-4 py-2 rounded-xl border ${
                scheduleType === 'weekly' ? 'bg-blue-500 border-blue-600' : 'bg-white border-gray-300'
              }`}
              activeOpacity={0.7}
            >
              <Text className={`text-sm font-semibold ${scheduleType === 'weekly' ? 'text-white' : 'text-gray-700'}`}>
                Haftalık
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {scheduleType === 'morningEvening' ? (
          <>
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-700 mb-2">Sabah Saati *</Text>
              <TouchableOpacity
                className="bg-white rounded-[16px] p-4 border border-gray-300"
                onPress={() => setShowMorningTimePicker(true)}
                activeOpacity={0.7}
                accessibilityLabel="Sabah saati seç"
                accessibilityRole="button"
                style={{ shadowColor: '#002BE0', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}
              >
                <Text className="text-lg font-semibold text-primary">{formatTime(morningTime)}</Text>
              </TouchableOpacity>
              {showMorningTimePicker && (
                <DateTimePicker
                  value={morningTime}
                  mode="time"
                  is24Hour={true}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleMorningTimeChange}
                />
              )}
            </View>
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-700 mb-2">Akşam Saati *</Text>
              <TouchableOpacity
                className="bg-white rounded-[16px] p-4 border border-gray-300"
                onPress={() => setShowEveningTimePicker(true)}
                activeOpacity={0.7}
                accessibilityLabel="Akşam saati seç"
                accessibilityRole="button"
                style={{ shadowColor: '#002BE0', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}
              >
                <Text className="text-lg font-semibold text-primary">{formatTime(eveningTime)}</Text>
              </TouchableOpacity>
              {showEveningTimePicker && (
                <DateTimePicker
                  value={eveningTime}
                  mode="time"
                  is24Hour={true}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleEveningTimeChange}
                />
              )}
            </View>
          </>
        ) : scheduleType === 'weekly' ? (
          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-700 mb-2">Günler *</Text>
            <View className="flex-row flex-wrap gap-2">
              {weekDays.map((day) => (
                <TouchableOpacity
                  key={day.key}
                  onPress={() => toggleDay(day.key)}
                  className={`px-4 py-2 rounded-xl border ${
                    selectedDays.includes(day.key)
                      ? 'bg-blue-500 border-blue-600'
                      : 'bg-white border-gray-300'
                  }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      selectedDays.includes(day.key) ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {day.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <>
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
            {scheduleType === 'everyXDays' && (
              <View className="mb-4">
                <Text className="text-base font-semibold text-gray-700 mb-2">Kaç Günde Bir? *</Text>
                <TextInput
                  className="bg-white rounded-[16px] p-4 text-base text-gray-800 border border-gray-300"
                  value={intervalDays}
                  onChangeText={setIntervalDays}
                  placeholder="Örn: 2"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                  accessibilityLabel="Aralık günleri"
                  style={{ shadowColor: '#002BE0', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}
                />
              </View>
            )}
          </>
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

export default AddMedicationScreen;
