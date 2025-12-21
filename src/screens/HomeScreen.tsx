import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMedications } from '../context/MedicationContext';
import { Medication } from '../types/medication';
import AddMedicationScreen from './AddMedicationScreen';
import MedicationItem from '../components/MedicationItem';

const HomeScreen: React.FC = () => {
    const { medications, deleteMedication } = useMedications();
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
            colors={['#E0E8FF', '#C0D1FF', '#A0B5FF']}
            className="flex-1"
            style={{ flex: 1 }}
        >
            <View className="bg-white pt-5 pb-5 px-5 rounded-b-[24px] border border-gray-200"
                style={{ shadowColor: '#002BE0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 }}
            >
                <Text className="text-[32px] font-bold text-primary mb-1">💊 haapp</Text>
                <Text className="text-base text-gray-700">İlaç Hatırlatma Uygulaması</Text>
            </View>

            {medications.length === 0 ? (
                <View className="flex-1 justify-center items-center px-10">
                    <Text className="text-xl font-semibold text-gray-600 mb-2 text-center">Henüz ilaç eklenmemiş</Text>
                    <Text className="text-sm text-gray-500 text-center">
                        Sağ alttaki butona tıklayarak ilaç ekleyebilirsiniz
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={medications}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <MedicationItem
                            medication={item}
                            onEdit={() => handleEditPress(item)}
                            onDelete={() => handleDeletePress(item)}
                        />
                    )}
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
                <Text className="text-[36px] text-white font-light" style={{ textAlign: 'center', lineHeight: 36 }}>+</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

export default HomeScreen;

