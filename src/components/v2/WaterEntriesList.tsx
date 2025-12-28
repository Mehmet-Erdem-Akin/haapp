import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ActionIcons } from '../../utils/icons';

interface WaterEntry {
  time: string;
  amount: number;
  totalAmount: number;
}

interface WaterEntriesListProps {
  entries: WaterEntry[];
  onDelete: (time: string) => void;
}

const WaterEntriesList: React.FC<WaterEntriesListProps> = ({ entries, onDelete }) => {
  if (entries.length === 0) {
    return null;
  }

  // En yeni üstte sırala (time'a göre ters sıralama)
  const sortedEntries = [...entries].sort((a, b) => {
    const [hoursA, minutesA] = a.time.split(':').map(Number);
    const [hoursB, minutesB] = b.time.split(':').map(Number);
    const timeA = hoursA * 60 + minutesA;
    const timeB = hoursB * 60 + minutesB;
    return timeB - timeA; // En yeni üstte
  });

  return (
    <View className="mb-6">
      <View className="flex-row items-center mb-3">
        <Text className="text-lg font-bold text-gray-900">Su İçme Kayıtları</Text>
      </View>
      <View className="gap-2">
        {sortedEntries.map((entry, index) => (
          <View
            key={`${entry.time}-${index}`}
            className="bg-white rounded-2xl p-4 flex-row justify-between items-center border border-gray-200 overflow-hidden"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900 mb-1">{entry.amount}ml</Text>
              <View className="flex-row items-center mb-0.5">
                <ActionIcons.Time size={14} color="#6B7280" />
                <Text className="text-sm text-gray-700 ml-1">{entry.time}</Text>
              </View>
              <Text className="text-xs text-blue-600 mt-1 font-semibold">
                Toplam: {(entry.totalAmount / 1000).toFixed(2)}L
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => onDelete(entry.time)}
              className="w-10 h-10 rounded-xl justify-center items-center bg-red-50 border border-red-200"
              activeOpacity={0.7}
              accessibilityLabel="Su kaydını sil"
              accessibilityRole="button"
            >
              <ActionIcons.Delete size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

export default WaterEntriesList;

