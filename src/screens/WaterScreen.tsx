import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useWater } from '../context/WaterContext';
import { useDaily } from '../context/DailyContext';
import { WaterReminder } from '../types/water';
import AddWaterReminderScreen from './AddWaterReminderScreen';
import WaterReminderItem from '../components/WaterReminderItem';

const WaterScreen: React.FC = () => {
  const { reminders, deleteReminder } = useWater();
  const { markWaterDrunk, getTotalWaterToday } = useDaily();
  const [showAddScreen, setShowAddScreen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<WaterReminder | null>(null);

  const totalWater = getTotalWaterToday();
  const totalLiters = (totalWater / 1000).toFixed(2);

  const handleAddPress = () => {
    setEditingReminder(null);
    setShowAddScreen(true);
  };

  const handleEditPress = (reminder: WaterReminder) => {
    setEditingReminder(reminder);
    setShowAddScreen(true);
  };

  const handleDeletePress = (reminder: WaterReminder) => {
    Alert.alert(
      'Hatırlatmayı Sil',
      `${reminder.amount}ml su hatırlatmasını silmek istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => deleteReminder(reminder.id),
        },
      ]
    );
  };

  const handleDrinkPress = async (amount: number) => {
    try {
      await markWaterDrunk(amount);
      Alert.alert('Başarılı', `${amount}ml su içildi olarak kaydedildi.`);
    } catch (error) {
      Alert.alert('Hata', 'Su kaydı güncellenirken bir hata oluştu.');
    }
  };

  const handleQuickDrink = (amount: number) => {
    Alert.alert(
      'Su İç',
      `${amount}ml su içtiniz mi?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Evet',
          onPress: () => handleDrinkPress(amount),
        },
      ]
    );
  };

  const handleCloseAddScreen = () => {
    setShowAddScreen(false);
    setEditingReminder(null);
  };

  if (showAddScreen) {
    return (
      <AddWaterReminderScreen
        reminder={editingReminder}
        onClose={handleCloseAddScreen}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💧 Su İçme</Text>
        <Text style={styles.subtitle}>Günlük Su Takibi</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{totalLiters}L</Text>
          <Text style={styles.statLabel}>Bugün İçilen</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{reminders.length}</Text>
          <Text style={styles.statLabel}>Hatırlatma</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.quickActionsTitle}>Hızlı Ekle</Text>
        <View style={styles.quickButtons}>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => handleQuickDrink(250)}
          >
            <Text style={styles.quickButtonText}>250ml</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => handleQuickDrink(500)}
          >
            <Text style={styles.quickButtonText}>500ml</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => handleQuickDrink(750)}
          >
            <Text style={styles.quickButtonText}>750ml</Text>
          </TouchableOpacity>
        </View>
      </View>

      {reminders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Henüz hatırlatma eklenmemiş</Text>
          <Text style={styles.emptySubtext}>
            Sağ alttaki butona tıklayarak hatırlatma ekleyebilirsiniz
          </Text>
        </View>
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WaterReminderItem
              reminder={item}
              onEdit={() => handleEditPress(item)}
              onDelete={() => handleDeletePress(item)}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddPress}
        activeOpacity={0.8}
        accessibilityLabel="Yeni hatırlatma ekle"
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
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  quickActions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  quickButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  quickButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  quickButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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

export default WaterScreen;

