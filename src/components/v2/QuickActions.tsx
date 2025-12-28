import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface QuickActionsProps {
  onAddWater: (amount: number) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAddWater }) => {
  const amounts = [250, 500, 750, 1000];

  return (
    <View className="mb-6">
      <Text className="text-lg font-bold text-gray-900 mb-3">Hızlı Ekle</Text>
      <View className="flex-row gap-3">
        {amounts.map((amount) => (
          <TouchableOpacity
            key={amount}
            onPress={() => onAddWater(amount)}
            className="flex-1 rounded-2xl overflow-hidden"
            activeOpacity={0.8}
            style={{
              shadowColor: '#3B82F6',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <View className="rounded-2xl py-3 items-center bg-blue-50 border border-blue-200">
              <Text className="text-base font-semibold text-blue-600">{amount}ml</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default QuickActions;


