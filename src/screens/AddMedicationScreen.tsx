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
import { Medication } from '../types/medication';

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

  useEffect(() => {
    if (medication) {
      setName(medication.name);
      setDosage(medication.dosage);
      const [hours, minutes] = medication.time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setTime(date);
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

  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
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
      const timeString = formatTime(time);
      const medicationData = {
        name: name.trim(),
        dosage: dosage.trim(),
        time: timeString,
        days: 'everyday' as const,
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

