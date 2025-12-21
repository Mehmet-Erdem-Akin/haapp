import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DailyRecord, DailyContextType } from '../types/daily';
import { dailyStorageService, getTodayDate } from '../services/dailyStorage';

const DailyContext = createContext<DailyContextType | undefined>(undefined);

interface DailyProviderProps {
  children: ReactNode;
  medications: Array<{ id: string; name: string; time: string }>;
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
      todayRecord = {
        date: today,
        medications: medications.length > 0 
          ? medications.map((med) => {
              const [hours, minutes] = med.time.split(':').map(Number);
              const medTime = new Date();
              medTime.setHours(hours, minutes, 0, 0);
              
              // Eğer ilaç saati geçmişse ve 30 dk içinde işaretlenmemişse, missed olarak işaretle
              const timeDiff = now.getTime() - medTime.getTime();
              const thirtyMinutes = 30 * 60 * 1000;
              const isMissed = timeDiff > thirtyMinutes && timeDiff > 0;
              
              return {
                medicationId: med.id,
                medicationName: med.name,
                time: med.time,
                taken: false,
                missed: isMissed,
              };
            })
          : [],
        water: [],
      };
      // Kaydı kaydet
      dailyStorageService.saveRecord(todayRecord).then(() => {
        setRecords([...records, todayRecord!]);
      });
    } else {
      // Mevcut kayıt varsa, yeni ilaçları ekle ve geçmiş ilaçları kontrol et
      const existingIds = todayRecord.medications.map((m) => m.medicationId);
      const newMedications = medications
        .filter((med) => !existingIds.includes(med.id))
        .map((med) => {
          const [hours, minutes] = med.time.split(':').map(Number);
          const medTime = new Date();
          medTime.setHours(hours, minutes, 0, 0);
          
          const timeDiff = now.getTime() - medTime.getTime();
          const thirtyMinutes = 30 * 60 * 1000;
          const isMissed = timeDiff > thirtyMinutes && timeDiff > 0;
          
          return {
            medicationId: med.id,
            medicationName: med.name,
            time: med.time,
            taken: false,
            missed: isMissed,
          };
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

    return todayRecord;
  };

  const markMedicationTaken = async (medicationId: string, date?: string) => {
    try {
      const targetDate = date || getTodayDate();
      const record = records.find((r) => r.date === targetDate) || getTodayRecord();
      
      const medication = record.medications.find((m) => m.medicationId === medicationId);
      if (medication) {
        medication.taken = true;
        medication.takenAt = new Date().toISOString();
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

