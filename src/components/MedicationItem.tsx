import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Medication } from '../types/medication';

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
            <View className="bg-success-100 border border-success-400 rounded-xl px-2 py-1">
              <Text className="text-xs font-semibold text-success-600">✓ İçildi</Text>
            </View>
          )}
        </View>
        <Text className="text-base text-gray-700 mb-2">{medication.dosage}</Text>
        <View className="flex-row items-center">
          <Text className="text-sm text-gray-600 mr-1.5">⏰ Saat:</Text>
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
            <Text className="text-lg text-white font-bold">✓</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="w-12 h-12 rounded-[24px] justify-center items-center bg-accent-100 border border-accent-200"
          onPress={onEdit}
          activeOpacity={0.7}
          accessibilityLabel="İlacı düzenle"
          accessibilityRole="button"
        >
          <Text className="text-lg">✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-12 h-12 rounded-[24px] justify-center items-center bg-danger-100 border border-danger-300"
          onPress={onDelete}
          activeOpacity={0.7}
          accessibilityLabel="İlacı sil"
          accessibilityRole="button"
        >
          <Text className="text-lg">🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MedicationItem;

