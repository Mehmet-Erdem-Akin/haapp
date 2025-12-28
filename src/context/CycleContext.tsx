import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CycleSettings, MenstrualCycleData, CycleRecord, MonthlyGoal, CycleContextType } from '../types/cycle';
import { cycleStorageService } from '../services/cycleStorage';

const CycleContext = createContext<CycleContextType | undefined>(undefined);

export const CycleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettingsState] = useState<CycleSettings>({
    isActive: false,
    cycleType: 'general',
  });
  const [menstrualData, setMenstrualDataState] = useState<MenstrualCycleData | undefined>(undefined);
  const [cycleRecords, setCycleRecords] = useState<CycleRecord[]>([]);
  const [monthlyGoals, setMonthlyGoals] = useState<MonthlyGoal[]>([]);

  useEffect(() => {
    loadCycleData();
  }, []);

  const loadCycleData = async () => {
    try {
      const [loadedSettings, loadedMenstrualData, loadedRecords, loadedGoals] = await Promise.all([
        cycleStorageService.getSettings(),
        cycleStorageService.getMenstrualData(),
        cycleStorageService.getCycleRecords(),
        cycleStorageService.getMonthlyGoals(),
      ]);

      setSettingsState(loadedSettings);
      setMenstrualDataState(loadedMenstrualData || undefined);
      setCycleRecords(loadedRecords);
      setMonthlyGoals(loadedGoals);
    } catch (error) {
      console.error('Cycle data yüklenirken hata:', error);
    }
  };

  const setSettings = async (newSettings: CycleSettings) => {
    try {
      await cycleStorageService.saveSettings(newSettings);
      setSettingsState(newSettings);
    } catch (error) {
      console.error('Cycle ayarları kaydedilirken hata:', error);
      throw error;
    }
  };

  const setMenstrualData = async (data: MenstrualCycleData) => {
    try {
      await cycleStorageService.saveMenstrualData(data);
      setMenstrualDataState(data);
    } catch (error) {
      console.error('Menstrual cycle data kaydedilirken hata:', error);
      throw error;
    }
  };

  const addCycleRecord = async (record: CycleRecord) => {
    try {
      await cycleStorageService.saveCycleRecord(record);
      const updatedRecords = cycleRecords.filter((r) => r.date !== record.date);
      updatedRecords.push(record);
      setCycleRecords(updatedRecords);
    } catch (error) {
      console.error('Cycle kaydı eklenirken hata:', error);
      throw error;
    }
  };

  const updateCycleRecord = async (date: string, recordData: Partial<CycleRecord>) => {
    try {
      const existingRecord = cycleRecords.find((r) => r.date === date);
      const updatedRecord: CycleRecord = {
        ...existingRecord,
        ...recordData,
        date,
      } as CycleRecord;

      await cycleStorageService.saveCycleRecord(updatedRecord);
      const updatedRecords = cycleRecords.map((r) => (r.date === date ? updatedRecord : r));
      setCycleRecords(updatedRecords);
    } catch (error) {
      console.error('Cycle kaydı güncellenirken hata:', error);
      throw error;
    }
  };

  const addMonthlyGoal = async (goalData: Omit<MonthlyGoal, 'id'>) => {
    try {
      const newGoal: MonthlyGoal = {
        ...goalData,
        id: Date.now().toString(),
      };

      const updatedGoals = [...monthlyGoals, newGoal];
      setMonthlyGoals(updatedGoals);
      await cycleStorageService.saveMonthlyGoals(updatedGoals);
    } catch (error) {
      console.error('Aylık hedef eklenirken hata:', error);
      throw error;
    }
  };

  const updateMonthlyGoal = async (id: string, goalData: Partial<MonthlyGoal>) => {
    try {
      const updatedGoals = monthlyGoals.map((g) => (g.id === id ? { ...g, ...goalData } : g));
      setMonthlyGoals(updatedGoals);
      await cycleStorageService.saveMonthlyGoals(updatedGoals);
    } catch (error) {
      console.error('Aylık hedef güncellenirken hata:', error);
      throw error;
    }
  };

  const deleteMonthlyGoal = async (id: string) => {
    try {
      const updatedGoals = monthlyGoals.filter((g) => g.id !== id);
      setMonthlyGoals(updatedGoals);
      await cycleStorageService.saveMonthlyGoals(updatedGoals);
    } catch (error) {
      console.error('Aylık hedef silinirken hata:', error);
      throw error;
    }
  };

  const value: CycleContextType = {
    settings,
    setSettings,
    menstrualData,
    setMenstrualData,
    cycleRecords,
    monthlyGoals,
    addMonthlyGoal,
    updateMonthlyGoal,
    deleteMonthlyGoal,
    addCycleRecord,
    updateCycleRecord,
    loadCycleData,
  };

  return <CycleContext.Provider value={value}>{children}</CycleContext.Provider>;
};

export const useCycle = (): CycleContextType => {
  const context = useContext(CycleContext);
  if (!context) {
    throw new Error('useCycle must be used within a CycleProvider');
  }
  return context;
};

