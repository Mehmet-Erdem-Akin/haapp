import React from 'react';
import { View, Text } from 'react-native';

interface MedicationsWeeklyChartProps {
  data: Array<{ day: string; taken: number; total: number }>;
}

const MedicationsWeeklyChart: React.FC<MedicationsWeeklyChartProps> = ({ data }) => {
  const maxTotal = Math.max(...data.map(d => d.total), 1);
  const chartHeight = 120;

  return (
    <View className="bg-white rounded-2xl p-4 border border-gray-200 mb-6">
      <Text className="text-lg font-bold text-gray-900 mb-4">Haftalık Özet</Text>
      
      <View className="relative" style={{ height: chartHeight }}>
        {/* Y-axis label */}
        <Text className="absolute right-0 top-0 text-xs text-gray-500">{maxTotal} ilaç</Text>
        
        {/* Chart bars */}
        <View className="flex-row items-end justify-between h-full pt-4">
          {data.map((item, index) => {
            const barHeight = (item.total / maxTotal) * (chartHeight - 20);
            const takenHeight = item.total > 0 ? (item.taken / item.total) * barHeight : 0;
            const percentage = item.total > 0 ? (item.taken / item.total) * 100 : 0;
            
            return (
              <View key={index} className="flex-1 items-center justify-end mx-1">
                <View className="w-full relative" style={{ height: Math.max(barHeight, 4) }}>
                  {/* Background bar (total) */}
                  <View
                    className="absolute bottom-0 w-full rounded-t-lg"
                    style={{
                      height: barHeight,
                      backgroundColor: '#E2E8F0',
                    }}
                  />
                  {/* Taken bar */}
                  {takenHeight > 0 && (
                    <View
                      className="absolute bottom-0 w-full rounded-t-lg"
                      style={{
                        height: takenHeight,
                        backgroundColor: percentage === 100 ? '#10B981' : percentage >= 50 ? '#8B5CF6' : '#F59E0B',
                      }}
                    />
                  )}
                </View>
                <Text className="text-xs text-gray-600 mt-2">{item.day}</Text>
              </View>
            );
          })}
        </View>
      </View>
      
      {/* Legend */}
      <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded bg-purple-500 mr-2" />
            <Text className="text-xs text-gray-600">Alınan</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded bg-gray-300 mr-2" />
            <Text className="text-xs text-gray-600">Toplam</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MedicationsWeeklyChart;

