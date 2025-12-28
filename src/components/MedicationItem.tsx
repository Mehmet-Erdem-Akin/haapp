import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Medication } from '../types/medication';
import { ActionIcons } from '../utils/icons';

interface MedicationItemProps {
  medication: Medication;
  isTaken?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onTaken?: () => void;
}

const MedicationItem: React.FC<MedicationItemProps> = ({
  medication,
  isTaken = false,
  onEdit,
  onDelete,
  onTaken,
}) => {
  return (
    <View 
      className={`rounded-[20px] p-4 mb-3 flex-row justify-between items-center border overflow-hidden ${
        isTaken ? 'border-l-4 border-l-success border-success-200' : 'border-gray-300'
      }`}
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
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-xl font-bold text-gray-900 mb-1">{medication.name}</Text>
          {isTaken && (
            <View className="bg-success-100 border border-success-400 rounded-xl px-2 py-1 flex-row items-center">
              <ActionIcons.CheckCircle size={14} color="#10B981" />
              <Text className="text-xs font-semibold text-success-600 ml-1">İçildi</Text>
            </View>
          )}
        </View>
        <Text className="text-base text-gray-700 mb-2">{medication.dosage}</Text>
        <View className="flex-row items-center">
          <ActionIcons.Time size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-1.5 mr-1.5">Saat:</Text>
          <Text className="text-base font-semibold text-primary">{medication.time}</Text>
        </View>
      </View>
      <View className="flex-row gap-2">
        {!isTaken && onTaken && (
          <TouchableOpacity
            className="w-12 h-12 rounded-[24px] justify-center items-center bg-success overflow-hidden"
            onPress={onTaken}
            activeOpacity={0.8}
            accessibilityLabel="İçildi olarak işaretle"
            accessibilityRole="button"
            style={{ shadowColor: '#44BEA4', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 }}
          >
            <ActionIcons.Check size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="w-12 h-12 rounded-[24px] justify-center items-center bg-accent-100 border border-accent-200"
          onPress={onEdit}
          activeOpacity={0.7}
          accessibilityLabel="İlacı düzenle"
          accessibilityRole="button"
        >
          <ActionIcons.Edit size={20} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity
          className="w-12 h-12 rounded-[24px] justify-center items-center bg-danger-100 border border-danger-300"
          onPress={onDelete}
          activeOpacity={0.7}
          accessibilityLabel="İlacı sil"
          accessibilityRole="button"
        >
          <ActionIcons.Delete size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MedicationItem;

