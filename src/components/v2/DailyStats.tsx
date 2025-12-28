import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

interface DailyStatsProps {
  entries: Array<{ amount: number; time: string; totalAmount: number }>;
  totalToday: number;
  dailyGoal: number;
}

const DailyStats: React.FC<DailyStatsProps> = ({
  entries,
  totalToday,
  dailyGoal,
}) => {
  const remaining = Math.max(0, dailyGoal - totalToday);
  
  // Ortalama hesapla (bugünkü girişler varsa)
  const average = entries.length > 0 
    ? Math.round(entries.reduce((sum, e) => sum + e.amount, 0) / entries.length)
    : 0;
  
  // Son içme zamanı
  const lastEntry = entries.length > 0 ? entries[0] : null;
  const lastDrinkTime = lastEntry 
    ? (() => {
        const now = new Date();
        const entryTime = new Date();
        const [hours, minutes] = lastEntry.time.split(':').map(Number);
        entryTime.setHours(hours, minutes, 0, 0);
        
        const diffMs = now.getTime() - entryTime.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Az önce';
        if (diffMins < 60) return `${diffMins} dk önce`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} saat önce`;
        return lastEntry.time;
      })()
    : 'Henüz yok';

  const stats = [
    {
      label: 'Kalan',
      value: `${remaining}ml`,
      icon: <MaterialIcons name="opacity" size={24} color="#3B82F6" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Ortalama',
      value: `${average}ml`,
      icon: <MaterialIcons name="trending-up" size={24} color="#10B981" />,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    },
    {
      label: 'Son İçme',
      value: lastDrinkTime,
      icon: <MaterialIcons name="access-time" size={24} color="#8B5CF6" />,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      label: 'Toplam',
      value: `${entries.length}x`,
      icon: <Ionicons name="flash-outline" size={24} color="#F59E0B" />,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
  ];

  return (
    <View className="mb-6">
      <View className="flex-row flex-wrap gap-3">
        {stats.map((stat, index) => (
          <View
            key={index}
            className={`flex-1 min-w-[45%] rounded-2xl p-4 border ${stat.bgColor} ${stat.borderColor}`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <View className="mb-2">{stat.icon}</View>
            <Text className="text-xs text-gray-600 mb-1">{stat.label}</Text>
            <Text className="text-lg font-bold text-gray-900">{stat.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default DailyStats;

