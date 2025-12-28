import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DailyRecord, DailyContextType } from '../types/daily';
import { dailyStorageService, getTodayDate } from '../services/dailyStorage';
import { Medication } from '../types/medication';
import { shouldTakeMedicationToday, getMedicationTimesForToday } from '../utils/medicationHelpers';

const DailyContext = createContext<DailyContextType | undefined>(undefined);

interface DailyProviderProps {
  children: ReactNode;
  medications: Medication[];
}

export const DailyProvider: React.FC<DailyProviderProps> = ({ children, medications }) => {
  const [records, setRecords] = useState<DailyRecord[]>([]);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const loadedRecords = await dailyStorageService.getRecords();
      setRecords(loadedRecords);
    } catch (error) {
      console.error('Günlük kayıtlar yüklenirken hata:', error);
    }
  };

  const getTodayRecord = (): DailyRecord => {
    const today = getTodayDate();
    let todayRecord = records.find((r) => r.date === today);
    const now = new Date();

    if (!todayRecord) {
      // Bugün için kayıt yoksa oluştur
      const todayMedications: DailyRecord['medications'] = [];
      const medicationKeys = new Set<string>();
      
      medications.forEach((med) => {
        // İlacın bugün alınması gerekip gerekmediğini kontrol et
        if (!shouldTakeMedicationToday(med, today)) {
          return;
        }

        // İlacın bugün için saatlerini al
        const times = getMedicationTimesForToday(med);
        
        // Her saat için bir kayıt oluştur (duplicate kontrolü ile)
        times.forEach((timeStr) => {
          const key = `${med.id}-${timeStr}`;
          // Aynı key'den daha önce eklenmişse atla
          if (medicationKeys.has(key)) {
            return;
          }
          medicationKeys.add(key);
          
          const [hours, minutes] = timeStr.split(':').map(Number);
          const medTime = new Date();
          medTime.setHours(hours, minutes, 0, 0);
          
          // Eğer ilaç saati geçmişse ve 30 dk içinde işaretlenmemişse, missed olarak işaretle
          const timeDiff = now.getTime() - medTime.getTime();
          const thirtyMinutes = 30 * 60 * 1000;
          const isMissed = timeDiff > thirtyMinutes && timeDiff > 0;
          
          todayMedications.push({
            medicationId: med.id,
            medicationName: med.name,
            time: timeStr,
            taken: false,
            missed: isMissed,
          });
        });
      });

      todayRecord = {
        date: today,
        medications: todayMedications,
        water: [],
      };
      // Kaydı kaydet
      dailyStorageService.saveRecord(todayRecord).then(() => {
        setRecords([...records, todayRecord!]);
      });
    } else {
      // Mevcut kayıt varsa, yeni ilaçları ekle ve geçmiş ilaçları kontrol et
      const existingKeys = new Set(
        todayRecord.medications.map((m) => `${m.medicationId}-${m.time}`)
      );
      const newMedications: DailyRecord['medications'] = [];
      
      medications.forEach((med) => {
        // İlacın bugün alınması gerekip gerekmediğini kontrol et
        if (!shouldTakeMedicationToday(med, today)) {
          return;
        }

        // İlacın bugün için saatlerini al
        const times = getMedicationTimesForToday(med);
        
        times.forEach((timeStr) => {
          const key = `${med.id}-${timeStr}`;
          if (!existingKeys.has(key)) {
            const [hours, minutes] = timeStr.split(':').map(Number);
            const medTime = new Date();
            medTime.setHours(hours, minutes, 0, 0);
            
            const timeDiff = now.getTime() - medTime.getTime();
            const thirtyMinutes = 30 * 60 * 1000;
            const isMissed = timeDiff > thirtyMinutes && timeDiff > 0;
            
            newMedications.push({
              medicationId: med.id,
              medicationName: med.name,
              time: timeStr,
              taken: false,
              missed: isMissed,
            });
          }
        });
      });
      
      // Mevcut ilaçları kontrol et - eğer saati geçmişse ve 30 dk içinde işaretlenmemişse missed olarak işaretle
      todayRecord.medications = todayRecord.medications.map((med) => {
        if (med.taken) {
          return med;
        }
        
        const [hours, minutes] = med.time.split(':').map(Number);
        const medTime = new Date();
        medTime.setHours(hours, minutes, 0, 0);
        
        const timeDiff = now.getTime() - medTime.getTime();
        const thirtyMinutes = 30 * 60 * 1000;
        const isMissed = timeDiff > thirtyMinutes && timeDiff > 0;
        
        return {
          ...med,
          missed: isMissed,
        };
      });
      
      if (newMedications.length > 0) {
        todayRecord.medications = [...todayRecord.medications, ...newMedications];
        dailyStorageService.saveRecord(todayRecord).then(() => {
          setRecords(records.map((r) => (r.date === today ? todayRecord! : r)));
        });
      } else {
        // Sadece missed durumunu güncelle
        dailyStorageService.saveRecord(todayRecord).then(() => {
          setRecords(records.map((r) => (r.date === today ? todayRecord! : r)));
        });
      }
    }

    // Duplicate'leri temizle (aynı medicationId-time kombinasyonu için sadece bir entry)
    const uniqueMedications: DailyRecord['medications'] = [];
    const seenKeys = new Set<string>();
    
    todayRecord.medications.forEach((med) => {
      const key = `${med.medicationId}-${med.time}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        uniqueMedications.push(med);
      }
    });
    
    todayRecord.medications = uniqueMedications;

    return todayRecord;
  };

  const markMedicationTaken = async (medicationId: string, time?: string, date?: string) => {
    try {
      const targetDate = date || getTodayDate();
      const record = records.find((r) => r.date === targetDate) || getTodayRecord();
      
      // Eğer time verilmişse, o saat için kaydı bul, yoksa ilk eşleşeni bul
      const medication = time 
        ? record.medications.find((m) => m.medicationId === medicationId && m.time === time)
        : record.medications.find((m) => m.medicationId === medicationId);
      
      if (medication) {
        medication.taken = true;
        medication.takenAt = new Date().toISOString();
        medication.missed = false; // Alındı olarak işaretlendiğinde missed flag'ini false yap
      }

      await dailyStorageService.saveRecord(record);
      
      const updatedRecords = records.map((r) => 
        r.date === targetDate ? record : r
      );
      if (!records.find((r) => r.date === targetDate)) {
        updatedRecords.push(record);
      }
      setRecords(updatedRecords);
    } catch (error) {
      console.error('İlaç kaydı güncellenirken hata:', error);
      throw error;
    }
  };

  const markWaterDrunk = async (amount: number, date?: string) => {
    try {
      const targetDate = date || getTodayDate();
      const record = records.find((r) => r.date === targetDate) || getTodayRecord();
      
      const now = new Date();
      const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      const totalAmount = record.water.reduce((sum, w) => sum + w.amount, 0) + amount;
      
      record.water.push({
        time: timeString,
        amount,
        totalAmount,
      });

      await dailyStorageService.saveRecord(record);
      
      const updatedRecords = records.map((r) => 
        r.date === targetDate ? record : r
      );
      if (!records.find((r) => r.date === targetDate)) {
        updatedRecords.push(record);
      }
      setRecords(updatedRecords);
    } catch (error) {
      console.error('Su kaydı güncellenirken hata:', error);
      throw error;
    }
  };

  const removeWaterEntry = async (time: string, date?: string) => {
    try {
      const targetDate = date || getTodayDate();
      const record = records.find((r) => r.date === targetDate);
      
      if (!record) {
        throw new Error('Kayıt bulunamadı');
      }

      // İlgili su kaydını bul ve sil
      const entryIndex = record.water.findIndex((w) => w.time === time);
      if (entryIndex === -1) {
        throw new Error('Su kaydı bulunamadı');
      }

      // Kaydı sil
      record.water.splice(entryIndex, 1);

      // Kalan kayıtların totalAmount'larını yeniden hesapla
      let runningTotal = 0;
      record.water.forEach((w) => {
        runningTotal += w.amount;
        w.totalAmount = runningTotal;
      });

      await dailyStorageService.saveRecord(record);
      
      const updatedRecords = records.map((r) => 
        r.date === targetDate ? record : r
      );
      setRecords(updatedRecords);
    } catch (error) {
      console.error('Su kaydı silinirken hata:', error);
      throw error;
    }
  };

  const removeMedicationEntry = async (medicationId: string, date?: string) => {
    try {
      const targetDate = date || getTodayDate();
      const record = records.find((r) => r.date === targetDate);
      
      if (!record) {
        throw new Error('Kayıt bulunamadı');
      }

      // İlgili ilaç kaydını bul ve sil
      const entryIndex = record.medications.findIndex((m) => m.medicationId === medicationId);
      if (entryIndex === -1) {
        throw new Error('İlaç kaydı bulunamadı');
      }

      // Kaydı sil
      record.medications.splice(entryIndex, 1);

      await dailyStorageService.saveRecord(record);
      
      const updatedRecords = records.map((r) => 
        r.date === targetDate ? record : r
      );
      setRecords(updatedRecords);
    } catch (error) {
      console.error('İlaç kaydı silinirken hata:', error);
      throw error;
    }
  };

  const getTotalWaterToday = (): number => {
    const todayRecord = getTodayRecord();
    return todayRecord.water.reduce((sum, w) => sum + w.amount, 0);
  };

  return (
    <DailyContext.Provider
      value={{
        records,
        markMedicationTaken,
        markWaterDrunk,
        removeWaterEntry,
        removeMedicationEntry,
        getTodayRecord,
        getTotalWaterToday,
        loadRecords,
      }}
    >
      {children}
    </DailyContext.Provider>
  );
};

export const useDaily = () => {
  const context = useContext(DailyContext);
  if (!context) {
    throw new Error('useDaily must be used within DailyProvider');
  }
  return context;
};

