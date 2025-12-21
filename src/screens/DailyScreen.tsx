import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useDaily } from '../context/DailyContext';
import { useMedications } from '../context/MedicationContext';

const DailyScreen: React.FC = () => {
  const { getTodayRecord, getTotalWaterToday } = useDaily();
  const { medications } = useMedications();
  const todayRecord = getTodayRecord();
  const totalWater = getTotalWaterToday();
  const totalLiters = (totalWater / 1000).toFixed(2);

  const takenMedications = todayRecord.medications.filter((m) => m.taken);
  const notTakenMedications = todayRecord.medications.filter((m) => !m.taken);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 Günlük Takip</Text>
        <Text style={styles.subtitle}>Bugünün Özeti</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{takenMedications.length}</Text>
          <Text style={styles.statLabel}>İçilen İlaç</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{notTakenMedications.length}</Text>
          <Text style={styles.statLabel}>Bekleyen İlaç</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{totalLiters}L</Text>
          <Text style={styles.statLabel}>İçilen Su</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✅ İçilen İlaçlar</Text>
        {takenMedications.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Henüz ilaç içilmedi</Text>
          </View>
        ) : (
          <FlatList
            data={takenMedications}
            keyExtractor={(item) => item.medicationId}
            renderItem={({ item }) => (
              <View style={styles.recordItem}>
                <View style={styles.recordContent}>
                  <Text style={styles.recordName}>{item.medicationName}</Text>
                  <Text style={styles.recordTime}>⏰ {item.time}</Text>
                  {item.takenAt && (
                    <Text style={styles.recordTakenAt}>
                      İçildi: {new Date(item.takenAt).toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  )}
                </View>
                <Text style={styles.checkmark}>✓</Text>
              </View>
            )}
            scrollEnabled={false}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⏳ Bekleyen İlaçlar</Text>
        {notTakenMedications.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Tüm ilaçlar içildi! 🎉</Text>
          </View>
        ) : (
          <FlatList
            data={notTakenMedications}
            keyExtractor={(item) => item.medicationId}
            renderItem={({ item }) => (
              <View style={[styles.recordItem, styles.pendingItem]}>
                <View style={styles.recordContent}>
                  <Text style={styles.recordName}>{item.medicationName}</Text>
                  <Text style={styles.recordTime}>⏰ {item.time}</Text>
                </View>
                <Text style={styles.pendingBadge}>Bekliyor</Text>
              </View>
            )}
            scrollEnabled={false}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💧 Su İçme Kayıtları</Text>
        {todayRecord.water.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Henüz su içilmedi</Text>
          </View>
        ) : (
          <FlatList
            data={todayRecord.water}
            keyExtractor={(item, index) => `${item.time}-${index}`}
            renderItem={({ item }) => (
              <View style={styles.recordItem}>
                <View style={styles.recordContent}>
                  <Text style={styles.recordName}>{item.amount}ml</Text>
                  <Text style={styles.recordTime}>⏰ {item.time}</Text>
                  <Text style={styles.recordTotal}>
                    Toplam: {(item.totalAmount / 1000).toFixed(2)}L
                  </Text>
                </View>
              </View>
            )}
            scrollEnabled={false}
          />
        )}
      </View>
    </ScrollView>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  recordItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  pendingItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#FFA500',
  },
  recordContent: {
    flex: 1,
  },
  recordName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  recordTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  recordTakenAt: {
    fontSize: 12,
    color: '#4A90E2',
    marginTop: 4,
  },
  recordTotal: {
    fontSize: 12,
    color: '#4A90E2',
    marginTop: 4,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 24,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  pendingBadge: {
    fontSize: 12,
    color: '#FFA500',
    fontWeight: '600',
    backgroundColor: '#FFF4E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});

export default DailyScreen;

