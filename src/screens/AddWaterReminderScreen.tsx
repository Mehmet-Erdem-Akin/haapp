import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
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
  const { addReminder, updateReminder } = useWater();
  const [amount, setAmount] = useState('');
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (reminder) {
      setAmount(reminder.amount.toString());
      const [hours, minutes] = reminder.time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setTime(date);
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

  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleSave = async () => {
    const amountNum = parseInt(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir miktar giriniz (ml).');
      return;
    }

    try {
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
    } catch (error: any) {
      const errorMessage = error?.message || 'Hatırlatma kaydedilirken bir hata oluştu.';
      Alert.alert('Hata', errorMessage);
      console.error('Hatırlatma kaydetme hatası:', error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {reminder ? 'Hatırlatmayı Düzenle' : 'Yeni Su Hatırlatması'}
        </Text>
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeButton}
          accessibilityLabel="Kapat"
          accessibilityRole="button"
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Miktar (ml) *</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="Örn: 250"
            placeholderTextColor="#999"
            keyboardType="numeric"
            accessibilityLabel="Su miktarı"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Hatırlatma Saati *</Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowTimePicker(true)}
            accessibilityLabel="Saat seç"
            accessibilityRole="button"
          >
            <Text style={styles.timeButtonText}>{formatTime(time)}</Text>
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
          style={styles.saveButton}
          onPress={handleSave}
          accessibilityLabel="Kaydet"
          accessibilityRole="button"
        >
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  timeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  timeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A90E2',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default AddWaterReminderScreen;

