import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WaterReminder } from '../types/water';

interface WaterReminderItemProps {
  reminder: WaterReminder;
  onEdit: () => void;
  onDelete: () => void;
}

const WaterReminderItem: React.FC<WaterReminderItemProps> = ({
  reminder,
  onEdit,
  onDelete,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.amount}>{reminder.amount}ml</Text>
        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>⏰ Saat:</Text>
          <Text style={styles.time}>{reminder.time}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={onEdit}
          accessibilityLabel="Hatırlatmayı düzenle"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={onDelete}
          accessibilityLabel="Hatırlatmayı sil"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    color: '#999',
    marginRight: 6,
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#E8F4F8',
  },
  deleteButton: {
    backgroundColor: '#FFE8E8',
  },
  buttonText: {
    fontSize: 20,
  },
});

export default WaterReminderItem;

