import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { WaterReminder } from '../types/water';
import { ActionIcons } from '../utils/icons';

interface WaterReminderItemProps {
  reminder: WaterReminder;
  onEdit: () => void;
  onDelete: () => void;
}

const WaterReminderItem: React.FC<WaterReminderItemProps> = ({
  reminder,
  onEdit,
  onDelete,
}) => {
  return (
    <View 
      className="rounded-[20px] p-4 mb-3 flex-row justify-between items-center border border-gray-300 overflow-hidden"
      style={{ 
        backgroundColor: '#FFFFFF',
        shadowColor: '#002BE0', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.15, 
        shadowRadius: 8, 
        elevation: 3 
      }}
    >
      <View className="flex-1">
        <Text className="text-xl font-bold text-primary mb-2">{reminder.amount}ml</Text>
        <View className="flex-row items-center">
          <ActionIcons.Time size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-1.5 mr-1.5">Saat:</Text>
          <Text className="text-base font-semibold text-primary">{reminder.time}</Text>
        </View>
      </View>
      <View className="flex-row gap-2">
        <TouchableOpacity
          className="w-12 h-12 rounded-[24px] justify-center items-center bg-accent-100 border border-accent-200"
          onPress={onEdit}
          activeOpacity={0.7}
          accessibilityLabel="Hatırlatmayı düzenle"
          accessibilityRole="button"
        >
          <ActionIcons.Edit size={20} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity
          className="w-12 h-12 rounded-[24px] justify-center items-center bg-danger-100 border border-danger-300"
          onPress={onDelete}
          activeOpacity={0.7}
          accessibilityLabel="Hatırlatmayı sil"
          accessibilityRole="button"
        >
          <ActionIcons.Delete size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WaterReminderItem;

