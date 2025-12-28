import React from 'react';
import { View, Text } from 'react-native';

interface WeeklyChartProps {
  data: Array<{ day: string; amount: number }>;
  dailyGoal: number;
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ data, dailyGoal }) => {
  const maxAmount = Math.max(...data.map(d => d.amount), dailyGoal, 1000);
  const chartHeight = 120;

  return (
    <View className="bg-white rounded-2xl p-4 border border-gray-200 mb-6">
      <Text className="text-lg font-bold text-gray-900 mb-4">Haftalık Özet</Text>
      
      <View className="relative" style={{ height: chartHeight }}>
        {/* Y-axis label */}
        <Text className="absolute right-0 top-0 text-xs text-gray-500">{maxAmount}ml</Text>
        
        {/* Chart bars */}
        <View className="flex-row items-end justify-between h-full pt-4">
          {data.map((item, index) => {
            const barHeight = (item.amount / maxAmount) * (chartHeight - 20);
            const percentage = (item.amount / dailyGoal) * 100;
            
            return (
              <View key={index} className="flex-1 items-center justify-end mx-1">
                <View
                  className="w-full rounded-t-lg"
                  style={{
                    height: Math.max(barHeight, 4),
                    backgroundColor: percentage >= 100 ? '#10B981' : percentage >= 50 ? '#3B82F6' : '#E2E8F0',
                  }}
                />
                <Text className="text-xs text-gray-600 mt-2">{item.day}</Text>
              </View>
            );
          })}
        </View>
      </View>
      
      {/* Daily goal */}
      <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <Text className="text-sm text-gray-600">Günlük hedef</Text>
        <Text className="text-sm font-semibold text-blue-600">{dailyGoal}ml</Text>
      </View>
    </View>
  );
};

export default WeeklyChart;


