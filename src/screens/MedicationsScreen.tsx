import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useMedications } from '../context/MedicationContext';
import { useDaily } from '../context/DailyContext';
import { Medication } from '../types/medication';
import AddMedicationScreen from './AddMedicationScreen';
import MedicationItem from '../components/MedicationItem';
import { ActionIcons, TabIcons } from '../utils/icons';

const MedicationsScreen: React.FC = () => {
    const { medications, deleteMedication } = useMedications();
    const { markMedicationTaken, getTodayRecord } = useDaily();
    const [showAddScreen, setShowAddScreen] = useState(false);
    const [editingMedication, setEditingMedication] = useState<Medication | null>(null);

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

    const handleTakenPress = async (medication: Medication) => {
        try {
            await markMedicationTaken(medication.id);
            Alert.alert('Başarılı', `${medication.name} içildi olarak işaretlendi.`);
        } catch (error) {
            Alert.alert('Hata', 'İlaç kaydı güncellenirken bir hata oluştu.');
        }
    };

    const handleCloseAddScreen = () => {
        setShowAddScreen(false);
        setEditingMedication(null);
    };

    const todayRecord = getTodayRecord();

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
            colors={['#E0E8FF', '#C0D1FF', '#A0B5FF']}
            className="flex-1"
            style={{ flex: 1 }}
        >
            <View
                className="bg-white pt-5 pb-5 px-5 rounded-b-[20px] border border-gray-200 overflow-hidden"
                style={{ shadowColor: '#002BE0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 }}
            >
                <View className="flex-row items-center mb-1">
                    <TabIcons.Medication size={32} color="#002BE0" />
                    <Text className="text-[32px] font-bold text-primary ml-2">İlaçlar</Text>
                </View>
                <Text className="text-base text-gray-700">İlaç Hatırlatmaları</Text>
            </View>

            {medications.length === 0 ? (
                <View className="flex-1 justify-center items-center px-10">
                    <Text className="text-xl font-semibold text-primary mb-2 text-center">Henüz ilaç eklenmemiş</Text>
                    <Text className="text-sm text-gray-700 text-center">
                        Sağ alttaki butona tıklayarak ilaç ekleyebilirsiniz
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={medications}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const isTaken = todayRecord.medications.find(
                            (m) => m.medicationId === item.id
                        )?.taken || false;

                        return (
                            <MedicationItem
                                medication={item}
                                isTaken={isTaken}
                                onEdit={() => handleEditPress(item)}
                                onDelete={() => handleDeletePress(item)}
                                onTaken={() => handleTakenPress(item)}
                            />
                        );
                    }}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ padding: 16 }}
                />
            )}

            <TouchableOpacity
                className="absolute right-5 bottom-5 w-[64px] h-[64px] rounded-[32px] bg-primary justify-center items-center"
                onPress={handleAddPress}
                activeOpacity={0.8}
                accessibilityLabel="Yeni ilaç ekle"
                accessibilityRole="button"
                style={{ shadowColor: '#002BE0', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 }}
            >
                <ActionIcons.Add size={32} color="#FFFFFF" />
            </TouchableOpacity>
        </LinearGradient>
    );
};

export default MedicationsScreen;

