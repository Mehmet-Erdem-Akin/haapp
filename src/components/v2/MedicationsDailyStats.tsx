import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

interface MedicationEntry {
  medicationId: string;
  medicationName: string;
  time: string;
  taken: boolean;
  takenAt?: string;
  missed?: boolean;
}

interface MedicationsDailyStatsProps {
  entries: MedicationEntry[];
  totalToday: number;
  totalMedications: number;
}

const MedicationsDailyStats: React.FC<MedicationsDailyStatsProps> = ({
  entries,
  totalToday,
  totalMedications,
}) => {
  const taken = entries.filter(e => e.taken).length;
  // Kaçırılan: taken olmayan ve missed olanlar
  const missed = entries.filter(e => !e.taken && e.missed).length;
  // Bekleyen: taken olmayan ve missed olmayanlar
  const pending = entries.filter(e => !e.taken && !e.missed).length;
  
  // Son alınan ilaç zamanı
  const lastTakenEntry = entries
    .filter(e => e.taken && e.takenAt)
    .sort((a, b) => (b.takenAt || '').localeCompare(a.takenAt || ''))[0];
  
  const lastTakenTime = lastTakenEntry && lastTakenEntry.takenAt
    ? (() => {
        const now = new Date();
        const takenTime = new Date(lastTakenEntry.takenAt);
        
        const diffMs = now.getTime() - takenTime.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Az önce';
        if (diffMins < 60) return `${diffMins} dk önce`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} saat önce`;
        return lastTakenEntry.time;
      })()
    : 'Henüz yok';

  const stats = [
    {
      label: 'Alınan',
      value: `${taken}`,
      icon: <Ionicons name="checkmark-circle" size={24} color="#10B981" />,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    },
    {
      label: 'Kaçırılan',
      value: `${missed}`,
      icon: <MaterialIcons name="cancel" size={24} color="#EF4444" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      label: 'Bekleyen',
      value: `${pending}`,
      icon: <MaterialIcons name="schedule" size={24} color="#F59E0B" />,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
    {
      label: 'Son Alınan',
      value: lastTakenTime,
      icon: <MaterialIcons name="access-time" size={24} color="#8B5CF6" />,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
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

export default MedicationsDailyStats;

