import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useMedications } from '../context/MedicationContext';
import { useDaily } from '../context/DailyContext';
import { Medication } from '../types/medication';
import AddMedicationScreen from './AddMedicationScreen';
import MedicationItem from '../components/MedicationItem';

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💊 İlaçlar</Text>
        <Text style={styles.subtitle}>İlaç Hatırlatmaları</Text>
      </View>

      {medications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Henüz ilaç eklenmemiş</Text>
          <Text style={styles.emptySubtext}>
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
          contentContainerStyle={styles.listContainer}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddPress}
        activeOpacity={0.8}
        accessibilityLabel="Yeni ilaç ekle"
        accessibilityRole="button"
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4A90E2',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#E8F4F8',
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
  },
});

export default MedicationsScreen;

