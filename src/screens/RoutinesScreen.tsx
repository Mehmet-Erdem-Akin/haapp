import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoutines } from '../context/RoutineContext';
import { Routine, DailyRoutineRecord } from '../types/routine';
import AddRoutineScreen from './AddRoutineScreen';
import Header from '../components/v2/Header';
import { ActionIcons, TabIcons } from '../utils/icons';
import { routineStorageService } from '../services/routineStorage';
import { getTodayDate } from '../services/dailyStorage';

const RoutinesScreen: React.FC = () => {
    const { routines, deleteRoutine } = useRoutines();
    const [showAddScreen, setShowAddScreen] = useState(false);
    const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
    const [todayRecords, setTodayRecords] = useState<DailyRoutineRecord['routines']>([]);

    const loadTodayRecords = async () => {
        try {
            const records = await routineStorageService.getDailyRecords();
            const today = getTodayDate();
            const todayRecord = records.find((r) => r.date === today);
            setTodayRecords(todayRecord?.routines || []);
        } catch (error) {
            console.error('Günlük rutin kayıtları yüklenirken hata:', error);
        }
    };

    // Bugünün rutinlerini yükle
    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            if (isMounted) {
                await loadTodayRecords();
            }
        };

        load();

        return () => {
            isMounted = false;
        };
    }, [routines]);

    // Bugünün rutinlerini filtrele
    const todayRoutines = useMemo(() => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Pazar, 1 = Pazartesi, ...
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayName = dayNames[dayOfWeek];

        return routines.filter((routine) => {
            switch (routine.repeatType) {
                case 'daily':
                    return true;
                case 'weekdays':
                    return dayOfWeek >= 1 && dayOfWeek <= 5;
                case 'weekends':
                    return dayOfWeek === 0 || dayOfWeek === 6;
                case 'weekly':
                case 'custom':
                    return routine.repeatDays?.includes(todayName) || false;
                default:
                    return false;
            }
        });
    }, [routines]);

    // Tamamlanma yüzdesi hesapla
    const completionPercentage = useMemo(() => {
        if (todayRoutines.length === 0) return 0;
        const completedCount = todayRecords.filter((r) => r.completed).length;
        return Math.min((completedCount / todayRoutines.length) * 100, 100);
    }, [todayRoutines.length, todayRecords]);

    const handleAddPress = () => {
        setEditingRoutine(null);
        setShowAddScreen(true);
    };

    const handleEditPress = (routine: Routine) => {
        setEditingRoutine(routine);
        setShowAddScreen(true);
    };

    const handleDeletePress = (routine: Routine) => {
        Alert.alert(
            'Rutini Sil',
            `${routine.title} rutinini silmek istediğinize emin misiniz?`,
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: () => deleteRoutine(routine.id),
                },
            ]
        );
    };

    const handleCloseAddScreen = () => {
        setShowAddScreen(false);
        setEditingRoutine(null);
        loadTodayRecords();
    };

    const handleToggleComplete = async (routineId: string) => {
        try {
            const today = getTodayDate();
            const records = await routineStorageService.getDailyRecords();
            const todayRecord = records.find((r) => r.date === today);

            const routine = routines.find((r) => r.id === routineId);
            if (!routine) return;

            const routineRecord = todayRecord?.routines.find((r) => r.routineId === routineId);

            if (routineRecord && todayRecord) {
                // Varsa güncelle
                routineRecord.completed = !routineRecord.completed;
                routineRecord.completedAt = routineRecord.completed ? new Date().toISOString() : undefined;
                await routineStorageService.saveDailyRecord(todayRecord);
            } else {
                // Yoksa yeni oluştur
                const newRecord: DailyRoutineRecord = {
                    date: today,
                    routines: [
                        ...(todayRecord?.routines || []),
                        {
                            routineId: routine.id,
                            routineTitle: routine.title,
                            time: routine.time,
                            completed: true,
                            completedAt: new Date().toISOString(),
                            subTasks: routine.subTasks.map((st) => ({
                                subTaskId: st.id,
                                task: st.task,
                                completed: false,
                            })),
                        },
                    ],
                };
                await routineStorageService.saveDailyRecord(newRecord);
            }

            loadTodayRecords();
        } catch (error) {
            console.error('Rutin durumu güncellenirken hata:', error);
            Alert.alert('Hata', 'Rutin durumu güncellenemedi');
        }
    };

    const handleToggleSubTask = async (routineId: string, subTaskId: string) => {
        try {
            const today = getTodayDate();
            const records = await routineStorageService.getDailyRecords();
            let todayRecord = records.find((r) => r.date === today);

            const routine = routines.find((r) => r.id === routineId);
            if (!routine) return;

            // Eğer bugün için kayıt yoksa oluştur
            if (!todayRecord) {
                todayRecord = {
                    date: today,
                    routines: [{
                        routineId: routine.id,
                        routineTitle: routine.title,
                        time: routine.time,
                        completed: false,
                        subTasks: routine.subTasks.map((st) => ({
                            subTaskId: st.id,
                            task: st.task,
                            completed: false,
                        })),
                    }],
                };
            }

            // Rutin kaydını bul veya oluştur
            let routineRecord = todayRecord.routines.find((r) => r.routineId === routineId);
            if (!routineRecord) {
                routineRecord = {
                    routineId: routine.id,
                    routineTitle: routine.title,
                    time: routine.time,
                    completed: false,
                    subTasks: routine.subTasks.map((st) => ({
                        subTaskId: st.id,
                        task: st.task,
                        completed: false,
                    })),
                };
                todayRecord.routines.push(routineRecord);
            }

            // Alt görevi bul ve toggle et
            const subTask = routineRecord.subTasks.find((st) => st.subTaskId === subTaskId);
            if (subTask) {
                subTask.completed = !subTask.completed;
            } else {
                // Alt görev kaydı yoksa oluştur
                const originalSubTask = routine.subTasks.find((st) => st.id === subTaskId);
                if (originalSubTask) {
                    routineRecord.subTasks.push({
                        subTaskId: originalSubTask.id,
                        task: originalSubTask.task,
                        completed: true,
                    });
                }
            }

            // Tüm alt görevler tamamlandıysa rutini de tamamlandı olarak işaretle
            const allSubTasksCompleted = routineRecord.subTasks.length > 0 &&
                routineRecord.subTasks.every((st) => st.completed);
            routineRecord.completed = allSubTasksCompleted;
            if (allSubTasksCompleted && !routineRecord.completedAt) {
                routineRecord.completedAt = new Date().toISOString();
            }

            await routineStorageService.saveDailyRecord(todayRecord);
            loadTodayRecords();
        } catch (error) {
            console.error('Alt görev durumu güncellenirken hata:', error);
            Alert.alert('Hata', 'Alt görev durumu güncellenemedi');
        }
    };

    if (showAddScreen) {
        return (
            <AddRoutineScreen
                routine={editingRoutine || undefined}
                onClose={handleCloseAddScreen}
            />
        );
    }

    return (
        <LinearGradient
            colors={['#E0E8FF', '#C0D1FF', '#A0B5FF']}
            className="flex-1"
            style={{ flex: 1 }}
        >
            <Header
                title="Günlük Rutinler"
                icon={<TabIcons.Routine size={24} color="#FFFFFF" />}
                rightAction={
                    <TouchableOpacity
                        onPress={handleAddPress}
                        className="bg-primary w-12 h-12 rounded-full items-center justify-center"
                    >
                        <ActionIcons.Add size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                }
            />

            <ScrollView className="flex-1 px-4 mt-4" showsVerticalScrollIndicator={false}>
                {/* Progress Card */}
                <View className="bg-white rounded-2xl p-4 mb-4 shadow-lg">
                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-lg font-semibold text-gray-800">Bugünün İlerlemesi</Text>
                        <Text className="text-2xl font-bold text-primary">{Math.round(completionPercentage)}%</Text>
                    </View>
                    <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <View
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </View>
                    <Text className="text-sm text-gray-600 mt-2">
                        {todayRecords.filter((r) => r.completed).length} / {todayRoutines.length} rutin tamamlandı
                    </Text>
                </View>

                {/* Today's Routines */}
                {todayRoutines.length === 0 ? (
                    <View className="bg-white rounded-2xl p-8 items-center mb-4">
                        <Text className="text-lg font-semibold text-gray-700 mb-2 text-center">
                            Bugün için rutin yok
                        </Text>
                        <Text className="text-sm text-gray-500 text-center">
                            Sağ üstteki butona tıklayarak yeni rutin ekleyebilirsiniz
                        </Text>
                    </View>
                ) : (
                    <View className="mb-4">
                        <Text className="text-lg font-semibold text-gray-800 mb-3">Bugünün Rutinleri</Text>
                        {todayRoutines.map((routine) => {
                            const record = todayRecords.find((r) => r.routineId === routine.id);
                            const isCompleted = record?.completed || false;

                            return (
                                <TouchableOpacity
                                    key={routine.id}
                                    onPress={() => handleToggleComplete(routine.id)}
                                    className="bg-white rounded-2xl p-4 mb-3 shadow-md flex-row items-center justify-between"
                                >
                                    <View className="flex-1">
                                        <View className="flex-row items-center mb-1">
                                            <Text className="text-base font-semibold text-gray-800 mr-2">
                                                {routine.title}
                                            </Text>
                                            <Text className="text-sm text-gray-500">{routine.time}</Text>
                                        </View>
                                        {routine.description && (
                                            <Text className="text-sm text-gray-600 mb-2">{routine.description}</Text>
                                        )}
                                        {routine.subTasks.length > 0 && (
                                            <View className="mt-2">
                                                {routine.subTasks.map((subTask) => {
                                                    const subTaskRecord = record?.subTasks.find(
                                                        (st) => st.subTaskId === subTask.id
                                                    );
                                                    const subTaskCompleted = subTaskRecord?.completed || false;

                                                    return (
                                                        <TouchableOpacity
                                                            key={subTask.id}
                                                            onPress={(e) => {
                                                                e.stopPropagation();
                                                                handleToggleSubTask(routine.id, subTask.id);
                                                            }}
                                                            className="flex-row items-center mb-1"
                                                        >
                                                            <View
                                                                className={`w-4 h-4 rounded border-2 mr-2 items-center justify-center ${subTaskCompleted
                                                                    ? 'bg-primary border-primary'
                                                                    : 'border-gray-300'
                                                                    }`}
                                                            >
                                                                {subTaskCompleted && (
                                                                    <ActionIcons.Check size={12} color="#FFFFFF" />
                                                                )}
                                                            </View>
                                                            <Text
                                                                className={`text-sm flex-1 ${subTaskCompleted ? 'text-gray-400 line-through' : 'text-gray-700'
                                                                    }`}
                                                            >
                                                                {subTask.task}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>
                                        )}
                                    </View>
                                    <View className="flex-row items-center gap-2 ml-4">
                                        <TouchableOpacity
                                            onPress={() => handleEditPress(routine)}
                                            className="p-2"
                                        >
                                            <ActionIcons.Edit size={20} color="#6B7280" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                handleDeletePress(routine);
                                            }}
                                            className="p-2"
                                        >
                                            <ActionIcons.Delete size={20} color="#EF4444" />
                                        </TouchableOpacity>
                                        <View
                                            className={`w-6 h-6 rounded-full border-2 items-center justify-center ${isCompleted
                                                ? 'bg-primary border-primary'
                                                : 'border-gray-300'
                                                }`}
                                        >
                                            {isCompleted && <ActionIcons.Check size={16} color="#FFFFFF" />}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {/* All Routines */}
                {routines.length > 0 && (
                    <View className="mb-4">
                        <Text className="text-lg font-semibold text-gray-800 mb-3">Tüm Rutinler</Text>
                        {routines.map((routine) => (
                            <TouchableOpacity
                                key={routine.id}
                                onPress={() => handleEditPress(routine)}
                                className="bg-white rounded-2xl p-4 mb-3 shadow-md"
                            >
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-1">
                                        <View className="flex-row items-center mb-1">
                                            <Text className="text-base font-semibold text-gray-800 mr-2">
                                                {routine.title}
                                            </Text>
                                            <Text className="text-sm text-gray-500">{routine.time}</Text>
                                        </View>
                                        {routine.description && (
                                            <Text className="text-sm text-gray-600 mb-2">{routine.description}</Text>
                                        )}
                                        {routine.subTasks.length > 0 && (
                                            <View className="mt-2">
                                                {routine.subTasks.map((subTask) => (
                                                    <View key={subTask.id} className="flex-row items-center mb-1">
                                                        <View
                                                            className="w-3 h-3 rounded border border-gray-300 mr-2"
                                                        />
                                                        <Text className="text-sm text-gray-700">
                                                            {subTask.task}
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                        <Text className="text-xs text-gray-400 mt-2">
                                            {routine.repeatType === 'daily' && 'Her gün'}
                                            {routine.repeatType === 'weekdays' && 'Hafta içi'}
                                            {routine.repeatType === 'weekends' && 'Hafta sonu'}
                                            {routine.repeatType === 'weekly' && 'Haftalık'}
                                            {routine.repeatType === 'custom' && 'Özel'}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            handleDeletePress(routine);
                                        }}
                                        className="p-2"
                                    >
                                        <ActionIcons.Delete size={20} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>
        </LinearGradient>
    );
};

export default RoutinesScreen;

