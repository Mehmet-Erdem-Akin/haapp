import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMedications } from '../context/MedicationContext';
import { useDaily } from '../context/DailyContext';
import { Medication } from '../types/medication';
import AddMedicationScreen from './AddMedicationScreen';
import Header from '../components/v2/Header';
import CircularProgress from '../components/v2/CircularProgress';
import MedicationsDailyStats from '../components/v2/MedicationsDailyStats';
import MedicationsWeeklyChart from '../components/v2/MedicationsWeeklyChart';
import MedicationEntriesList from '../components/v2/MedicationEntriesList';
import { ActionIcons, TabIcons } from '../utils/icons';

const MedicationsScreen: React.FC = () => {
    const { medications, deleteMedication } = useMedications();
    const { markMedicationTaken, removeMedicationEntry, getTodayRecord, records } = useDaily();
    const [showAddScreen, setShowAddScreen] = useState(false);
    const [editingMedication, setEditingMedication] = useState<Medication | null>(null);

    const todayRecord = getTodayRecord();
    const totalMedications = todayRecord.medications.length;
    const takenMedications = todayRecord.medications.filter((m) => m.taken).length;
    const percentage = totalMedications > 0 ? Math.min((takenMedications / totalMedications) * 100, 100) : 0;

    // Haftalık veri hesapla
    const weeklyData = useMemo(() => {
        const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
        const data = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const record = records.find(r => r.date === dateStr);
            
            const total = record?.medications.length || 0;
            const taken = record?.medications.filter(m => m.taken).length || 0;
            
            data.push({
                day: days[date.getDay() === 0 ? 6 : date.getDay() - 1],
                taken,
                total,
            });
        }
        
        return data;
    }, [records]);

    const handleAddPress = () => {
        setEditingMedication(null);
        setShowAddScreen(true);
    };

    const handleEditPress = (medication: Medication) => {
        setEditingMedication(medication);
        setShowAddScreen(true);
    };

    const handleDeletePress = (medication: Medication) => {
        Alert.alert(
            'İlacı Sil',
            `${medication.name} ilacını silmek istediğinize emin misiniz?`,
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: () => deleteMedication(medication.id),
                },
            ]
        );
    };

    const handleMarkTaken = async (medicationId: string, time: string) => {
        try {
            await markMedicationTaken(medicationId, time);
        } catch (error) {
            Alert.alert('Hata', 'İlaç kaydı güncellenirken bir hata oluştu.');
        }
    };

    const handleDeleteMedicationEntry = async (medicationId: string) => {
        const medication = medications.find((m) => m.id === medicationId);
        const medicationName = medication?.name || 'İlaç';
        
        Alert.alert(
            'İlaç Kaydını Sil',
            `"${medicationName}" ilaç kaydını bugünün kayıtlarından silmek istediğinize emin misiniz?`,
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await removeMedicationEntry(medicationId);
                        } catch (error) {
                            Alert.alert('Hata', 'İlaç kaydı silinirken bir hata oluştu.');
                        }
                    },
                },
            ]
        );
    };

    const handleCloseAddScreen = () => {
        setShowAddScreen(false);
        setEditingMedication(null);
    };

    if (showAddScreen) {
        return (
            <AddMedicationScreen
                medication={editingMedication}
                onClose={handleCloseAddScreen}
            />
        );
    }

    return (
        <LinearGradient
            colors={['#F8FAFC', '#F1F5F9']}
            style={{ flex: 1 }}
        >
            {/* Header */}
            <Header
                title="İlaçlar"
                subtitle="İlaç Hatırlatmaları"
                icon={<TabIcons.Medication size={24} color="#FFFFFF" />}
                iconGradient={['#8B5CF6', '#A78BFA']}
                rightAction={
                    <TouchableOpacity
                        onPress={handleAddPress}
                        className="bg-primary w-12 h-12 rounded-full items-center justify-center"
                    >
                        <ActionIcons.Add size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                }
            />

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
                {medications.length === 0 ? (
                    <View className="bg-white rounded-2xl p-8 items-center border border-gray-200"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.05,
                            shadowRadius: 4,
                            elevation: 2,
                        }}
                    >
                        <TabIcons.Medication size={48} color="#9CA3AF" />
                        <Text className="text-xl font-semibold text-gray-900 mt-4 mb-2 text-center">
                            Henüz ilaç eklenmemiş
                        </Text>
                        <Text className="text-sm text-gray-600 text-center">
                            Sağ üstteki butona tıklayarak ilaç ekleyebilirsiniz
                        </Text>
                    </View>
                ) : (
                    <>
                        {/* Circular Progress */}
                        <CircularProgress 
                            percentage={percentage}
                            totalToday={takenMedications}
                            total={totalMedications}
                            icon={<TabIcons.Medication size={32} color="#8B5CF6" />}
                            unit="ilaç"
                            gradientColors={['#8B5CF6', '#A78BFA']}
                            successMessage="Tüm ilaçlarınızı aldınız"
                            defaultMessage="Günlük ilaç takibi"
                        />

                        {/* Daily Stats */}
                        <MedicationsDailyStats 
                            entries={todayRecord.medications}
                            totalToday={takenMedications}
                            totalMedications={totalMedications}
                        />

                        {/* Medication Entries List */}
                        <MedicationEntriesList 
                            entries={todayRecord.medications}
                            onMarkTaken={handleMarkTaken}
                            onDelete={handleDeleteMedicationEntry}
                        />

                        {/* Weekly Chart */}
                        <MedicationsWeeklyChart data={weeklyData} />
                    </>
                )}
            </ScrollView>
        </LinearGradient>
    );
};

export default MedicationsScreen;

