import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Medication, MedicationContextType } from '../types/medication';
import { storageService } from '../services/storage';
import { notificationService } from '../services/notifications';

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const MedicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [medications, setMedications] = useState<Medication[]>([]);

  // Uygulama açıldığında ilaçları yükle
  useEffect(() => {
    loadMedications();
  }, []);

  // İlaçlar değiştiğinde bildirimleri yeniden planla
  useEffect(() => {
    if (medications.length > 0) {
      notificationService.rescheduleAllNotifications(medications);
    }
  }, [medications.length]);

  const loadMedications = async () => {
    try {
      const loadedMedications = await storageService.getMedications();
      setMedications(loadedMedications);
    } catch (error) {
      console.error('İlaçlar yüklenirken hata:', error);
    }
  };

  const addMedication = async (medicationData: Omit<Medication, 'id' | 'notificationId'>) => {
    try {
      const newMedication: Medication = {
        scheduleType: 'daily', // Default schedule type
        ...medicationData,
        id: Date.now().toString(),
      };

      // Bildirim oluştur (hata olsa bile ilacı kaydet)
      try {
        const notificationId = await notificationService.scheduleNotification(newMedication);
        newMedication.notificationId = notificationId;
      } catch (notificationError) {
        console.warn('Bildirim oluşturulamadı, ilaç yine de kaydediliyor:', notificationError);
        // Bildirim hatası olsa bile ilacı kaydet
      }

      const updatedMedications = [...medications, newMedication];
      setMedications(updatedMedications);
      await storageService.saveMedications(updatedMedications);
    } catch (error) {
      console.error('İlaç eklenirken hata:', error);
      throw error;
    }
  };

  const updateMedication = async (id: string, updates: Partial<Medication>) => {
    try {
      const updatedMedications = medications.map((med) => {
        if (med.id === id) {
          const updated = { ...med, ...updates };
          
          // Eğer zaman değiştiyse bildirimi yeniden planla
          if (updates.time && updates.time !== med.time) {
            if (med.notificationId) {
              notificationService.cancelNotification(med.notificationId);
            }
            notificationService.scheduleNotification(updated).then((notificationId) => {
              updated.notificationId = notificationId;
            });
          }
          
          return updated;
        }
        return med;
      });

      setMedications(updatedMedications);
      await storageService.saveMedications(updatedMedications);
    } catch (error) {
      console.error('İlaç güncellenirken hata:', error);
      throw error;
    }
  };

  const deleteMedication = async (id: string) => {
    try {
      const medication = medications.find((med) => med.id === id);
      if (medication?.notificationId) {
        await notificationService.cancelNotification(medication.notificationId);
      }

      const updatedMedications = medications.filter((med) => med.id !== id);
      setMedications(updatedMedications);
      await storageService.saveMedications(updatedMedications);
    } catch (error) {
      console.error('İlaç silinirken hata:', error);
      throw error;
    }
  };

  return (
    <MedicationContext.Provider
      value={{
        medications,
        addMedication,
        updateMedication,
        deleteMedication,
        loadMedications,
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedications = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedications must be used within MedicationProvider');
  }
  return context;
};

