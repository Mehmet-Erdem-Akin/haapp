import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ActionIcons } from '../../utils/icons';

interface MedicationEntry {
  medicationId: string;
  medicationName: string;
  time: string;
  taken: boolean;
  takenAt?: string;
  missed?: boolean;
}

interface MedicationEntriesListProps {
  entries: MedicationEntry[];
  onMarkTaken: (medicationId: string, time: string) => void;
  onDelete?: (medicationId: string) => void;
}

const MedicationEntriesList: React.FC<MedicationEntriesListProps> = ({ entries, onMarkTaken, onDelete }) => {
  if (entries.length === 0) {
    return null;
  }

  // En yeni üstte sırala
  const sortedEntries = [...entries].sort((a, b) => {
    // Eğer ikisi de alınmışsa, takenAt'e göre ters sırala (en yeni alınan üstte)
    if (a.taken && b.taken && a.takenAt && b.takenAt) {
      return new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime();
    }
    // Eğer sadece biri alınmışsa, alınan üstte
    if (a.taken && a.takenAt) return -1;
    if (b.taken && b.takenAt) return 1;
    // İkisi de alınmamışsa, time'a göre ters sırala (en sonraki saat üstte: 20:00 > 18:00 > 15:00)
    const [hoursA, minutesA] = a.time.split(':').map(Number);
    const [hoursB, minutesB] = b.time.split(':').map(Number);
    const timeA = hoursA * 60 + minutesA;
    const timeB = hoursB * 60 + minutesB;
    return timeB - timeA; // En sonraki saat üstte
  });

  return (
    <View className="mb-6">
      <View className="flex-row items-center mb-3">
        <Text className="text-lg font-bold text-gray-900">Bugünkü İlaçlar</Text>
      </View>
      <View className="gap-2">
        {sortedEntries.map((entry) => (
          <View
            key={`${entry.medicationId}-${entry.time}`}
            className={`rounded-2xl p-4 flex-row justify-between items-center border overflow-hidden ${
              entry.taken ? 'bg-emerald-50 border-emerald-200' : entry.missed ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
            }`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-lg font-semibold text-gray-900">{entry.medicationName}</Text>
                <View className="flex-row items-center gap-2 mr-2">
                  {entry.taken && (
                    <View className="bg-emerald-100 border border-emerald-400 rounded-xl px-2 py-1 flex-row items-center">
                      <ActionIcons.CheckCircle size={14} color="#10B981" />
                      <Text className="text-xs font-semibold text-emerald-700 ml-1">Alındı</Text>
                    </View>
                  )}
                  {entry.missed && !entry.taken && (
                    <View className="bg-red-100 border border-red-400 rounded-xl px-2 py-1 flex-row items-center">
                      <ActionIcons.Cancel size={14} color="#EF4444" />
                      <Text className="text-xs font-semibold text-red-700 ml-1">Kaçırıldı</Text>
                    </View>
                  )}
                </View>
              </View>
              <View className="flex-row items-center">
                <ActionIcons.Time size={14} color="#6B7280" />
                <Text className="text-sm text-gray-700 ml-1">{entry.time}</Text>
                {entry.taken && entry.takenAt && (
                  <>
                    <Text className="text-sm text-gray-500 mx-2">•</Text>
                    <Text className="text-xs text-gray-500">
                      {new Date(entry.takenAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </>
                )}
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              {!entry.taken && (
                <TouchableOpacity
                  onPress={() => onMarkTaken(entry.medicationId, entry.time)}
                  className="w-10 h-10 rounded-xl justify-center items-center bg-purple-500"
                  activeOpacity={0.7}
                  accessibilityLabel="İlacı alındı olarak işaretle"
                  accessibilityRole="button"
                >
                  <ActionIcons.Check size={18} color="#FFFFFF" />
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity
                  onPress={() => onDelete(entry.medicationId)}
                  className="w-10 h-10 rounded-xl justify-center items-center bg-red-50 border border-red-200"
                  activeOpacity={0.7}
                  accessibilityLabel="İlaç kaydını sil"
                  accessibilityRole="button"
                >
                  <ActionIcons.Delete size={18} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default MedicationEntriesList;

