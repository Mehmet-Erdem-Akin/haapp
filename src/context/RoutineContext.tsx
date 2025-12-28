import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Routine, RoutineContextType } from '../types/routine';
import { routineStorageService } from '../services/routineStorage';
// import { routineNotificationService } from '../services/routineNotifications'; // Bildirim servisi ileride eklenecek

const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

export const RoutineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    loadRoutines();
  }, []);

  // Rutinler değiştiğinde bildirimleri yeniden planla (ileride eklenecek)
  // useEffect(() => {
  //   if (routines.length > 0) {
  //     routineNotificationService.rescheduleAllNotifications(routines);
  //   }
  // }, [routines.length]);

  const loadRoutines = async () => {
    try {
      const loadedRoutines = await routineStorageService.getRoutines();
      setRoutines(loadedRoutines);
    } catch (error) {
      console.error('Rutinler yüklenirken hata:', error);
    }
  };

  const addRoutine = async (routineData: Omit<Routine, 'id' | 'notificationId'>) => {
    try {
      const newRoutine: Routine = {
        ...routineData,
        id: Date.now().toString(),
      };

      // Bildirim oluştur (ileride eklenecek)
      // try {
      //   const notificationId = await routineNotificationService.scheduleNotification(newRoutine);
      //   newRoutine.notificationId = notificationId;
      // } catch (notificationError) {
      //   console.warn('Bildirim oluşturulamadı, rutin yine de kaydediliyor:', notificationError);
      // }

      const updatedRoutines = [...routines, newRoutine];
      setRoutines(updatedRoutines);
      await routineStorageService.saveRoutines(updatedRoutines);
    } catch (error) {
      console.error('Rutin eklenirken hata:', error);
      throw error;
    }
  };

  const updateRoutine = async (id: string, routineData: Partial<Routine>) => {
    try {
      const routine = routines.find((r) => r.id === id);
      if (!routine) {
        throw new Error('Rutin bulunamadı');
      }

      // Eski bildirimi iptal et (ileride eklenecek)
      // if (routine.notificationId) {
      //   await routineNotificationService.cancelNotification(routine.notificationId);
      // }

      const updatedRoutine: Routine = {
        ...routine,
        ...routineData,
      };

      // Yeni bildirim oluştur (ileride eklenecek)
      // try {
      //   const notificationId = await routineNotificationService.scheduleNotification(updatedRoutine);
      //   updatedRoutine.notificationId = notificationId;
      // } catch (notificationError) {
      //   console.warn('Bildirim oluşturulamadı:', notificationError);
      // }

      const updatedRoutines = routines.map((r) => (r.id === id ? updatedRoutine : r));
      setRoutines(updatedRoutines);
      await routineStorageService.saveRoutines(updatedRoutines);
    } catch (error) {
      console.error('Rutin güncellenirken hata:', error);
      throw error;
    }
  };

  const deleteRoutine = async (id: string) => {
    try {
      const routine = routines.find((r) => r.id === id);
      if (routine?.notificationId) {
        // await routineNotificationService.cancelNotification(routine.notificationId);
      }

      const updatedRoutines = routines.filter((r) => r.id !== id);
      setRoutines(updatedRoutines);
      await routineStorageService.saveRoutines(updatedRoutines);
    } catch (error) {
      console.error('Rutin silinirken hata:', error);
      throw error;
    }
  };

  const value: RoutineContextType = {
    routines,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    loadRoutines,
  };

  return <RoutineContext.Provider value={value}>{children}</RoutineContext.Provider>;
};

export const useRoutines = (): RoutineContextType => {
  const context = useContext(RoutineContext);
  if (!context) {
    throw new Error('useRoutines must be used within a RoutineProvider');
  }
  return context;
};

