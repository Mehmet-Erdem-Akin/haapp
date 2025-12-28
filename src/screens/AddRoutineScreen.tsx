import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoutines } from '../context/RoutineContext';
import { Routine, RoutineRepeatType, SubTask } from '../types/routine';
import Header from '../components/v2/Header';
import { ActionIcons, TabIcons } from '../utils/icons';

interface AddRoutineScreenProps {
  routine?: Routine;
  onClose: () => void;
}

const AddRoutineScreen: React.FC<AddRoutineScreenProps> = ({ routine, onClose }) => {
  const { addRoutine, updateRoutine } = useRoutines();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState(new Date());
  const [repeatType, setRepeatType] = useState<RoutineRepeatType>('daily');
  const [repeatDays, setRepeatDays] = useState<string[]>([]);
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [newSubTaskText, setNewSubTaskText] = useState('');

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayLabels = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

  useEffect(() => {
    if (routine) {
      setTitle(routine.title);
      setDescription(routine.description || '');
      const [hours, minutes] = routine.time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setTime(date);
      setRepeatType(routine.repeatType);
      setRepeatDays(routine.repeatDays || []);
      setSubTasks(routine.subTasks || []);
    }
  }, [routine]);

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

  const handleToggleDay = (day: string) => {
    if (repeatDays.includes(day)) {
      setRepeatDays(repeatDays.filter((d) => d !== day));
    } else {
      setRepeatDays([...repeatDays, day]);
    }
  };

  const handleAddSubTask = () => {
    if (newSubTaskText.trim()) {
      const newSubTask: SubTask = {
        id: Date.now().toString(),
        task: newSubTaskText.trim(),
        completed: false,
      };
      setSubTasks([...subTasks, newSubTask]);
      setNewSubTaskText('');
      Keyboard.dismiss();
    }
  };

  const handleRemoveSubTask = (id: string) => {
    setSubTasks(subTasks.filter((st) => st.id !== id));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Hata', 'Lütfen rutin başlığı girin');
      return;
    }

    if ((repeatType === 'weekly' || repeatType === 'custom') && repeatDays.length === 0) {
      Alert.alert('Hata', 'Lütfen en az bir gün seçin');
      return;
    }

    try {
      const routineData = {
        title: title.trim(),
        description: description.trim() || undefined,
        time: formatTime(time),
        repeatType,
        repeatDays: repeatType === 'weekly' || repeatType === 'custom' ? repeatDays : undefined,
        subTasks,
        color: routine?.color,
      };

      if (routine) {
        await updateRoutine(routine.id, routineData);
      } else {
        await addRoutine(routineData);
      }

      onClose();
    } catch (error) {
      console.error('Rutin kaydedilirken hata:', error);
      Alert.alert('Hata', 'Rutin kaydedilemedi');
    }
  };

  return (
    <LinearGradient colors={['#E0E8FF', '#C0D1FF', '#A0B5FF']} className="flex-1" style={{ flex: 1 }}>
      <Header
        title={routine ? 'Rutini Düzenle' : 'Yeni Rutin'}
        icon={<TabIcons.Routine size={24} color="#FFFFFF" />}
        rightAction={
          <TouchableOpacity onPress={onClose} className="p-2">
            <ActionIcons.Cancel size={24} color="#6B7280" />
          </TouchableOpacity>
        }
      />

      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Başlık *</Text>
          <TextInput
            className="bg-white rounded-xl p-4 text-base text-gray-800 border border-gray-200"
            placeholder="Örn: Sabah Rutini"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Description */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Açıklama</Text>
          <TextInput
            className="bg-white rounded-xl p-4 text-base text-gray-800 border border-gray-200"
            placeholder="Opsiyonel açıklama"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Time */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Saat</Text>
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            className="bg-white rounded-xl p-4 border border-gray-200 flex-row items-center justify-between"
          >
            <Text className="text-base text-gray-800">{formatTime(time)}</Text>
            <ActionIcons.Time size={20} color="#6B7280" />
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

        {/* Repeat Type */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Tekrarlama</Text>
          <View className="flex-row flex-wrap gap-2">
            {(['daily', 'weekdays', 'weekends', 'weekly', 'custom'] as RoutineRepeatType[]).map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setRepeatType(type)}
                className={`px-4 py-2 rounded-xl border-2 ${
                  repeatType === type
                    ? 'bg-primary border-primary'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    repeatType === type ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {type === 'daily' && 'Her gün'}
                  {type === 'weekdays' && 'Hafta içi'}
                  {type === 'weekends' && 'Hafta sonu'}
                  {type === 'weekly' && 'Haftalık'}
                  {type === 'custom' && 'Özel'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Repeat Days (for weekly/custom) */}
        {(repeatType === 'weekly' || repeatType === 'custom') && (
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Günler</Text>
            <View className="flex-row flex-wrap gap-2">
              {dayNames.map((day, index) => (
                <TouchableOpacity
                  key={day}
                  onPress={() => handleToggleDay(day)}
                  className={`px-4 py-2 rounded-xl border-2 ${
                    repeatDays.includes(day)
                      ? 'bg-primary border-primary'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      repeatDays.includes(day) ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {dayLabels[index]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Sub Tasks */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Alt Görevler</Text>
          
          {subTasks.map((subTask) => (
            <View
              key={subTask.id}
              className="bg-white rounded-xl p-3 mb-2 flex-row items-center justify-between border border-gray-200"
            >
              <Text className="text-base text-gray-800 flex-1">{subTask.task}</Text>
              <TouchableOpacity
                onPress={() => handleRemoveSubTask(subTask.id)}
                className="ml-2"
              >
                <ActionIcons.Delete size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}

          <View className="flex-row gap-2">
            <TextInput
              className="flex-1 bg-white rounded-xl p-3 text-base text-gray-800 border border-gray-200"
              placeholder="Alt görev ekle..."
              value={newSubTaskText}
              onChangeText={setNewSubTaskText}
              onSubmitEditing={handleAddSubTask}
              returnKeyType="done"
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity
              onPress={handleAddSubTask}
              className="bg-primary px-4 py-3 rounded-xl items-center justify-center"
            >
              <ActionIcons.Add size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          className="bg-primary py-4 rounded-xl items-center mb-8 mt-2"
        >
          <Text className="text-white text-lg font-semibold">Kaydet</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default AddRoutineScreen;

