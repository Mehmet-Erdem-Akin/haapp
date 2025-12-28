import { Medication } from '../types/medication';
import { getTodayDate } from '../services/dailyStorage';

/**
 * İlacın bugün alınması gerekip gerekmediğini kontrol eder
 */
export const shouldTakeMedicationToday = (medication: Medication, date?: string): boolean => {
  const today = date || getTodayDate();
  const todayDate = new Date(today);
  const dayOfWeek = todayDate.getDay(); // 0 = Pazar, 1 = Pazartesi, ...
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayDayName = dayNames[dayOfWeek];

  const scheduleType = medication.scheduleType || 'daily'; // Backward compatibility

  switch (scheduleType) {
    case 'daily':
      return true;
    
    case 'everyXDays':
      if (!medication.intervalDays) return true;
      // Başlangıç tarihini ilaç ID'sinden hesapla (basitleştirilmiş yaklaşım)
      // İlaç ID'si timestamp ise, o tarihten itibaren hesaplayalım
      // Gerçek uygulamada başlangıç tarihi medication'a eklenebilir
      try {
        const startTimestamp = parseInt(medication.id);
        if (!isNaN(startTimestamp)) {
          const startDate = new Date(startTimestamp);
          startDate.setHours(0, 0, 0, 0);
          const diffTime = todayDate.getTime() - startDate.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          return diffDays % medication.intervalDays === 0;
        }
      } catch (e) {
        // Hata durumunda true döndür (günlük gibi davran)
      }
      return true;
    
    case 'weekly':
      if (medication.days === 'everyday') return true;
      if (Array.isArray(medication.days)) {
        return medication.days.includes(todayDayName);
      }
      return false;
    
    case 'morningEvening':
      return true; // Her gün sabah ve akşam
    
    default:
      return true;
  }
};

/**
 * İlacın bugün için saatlerini döndürür
 */
export const getMedicationTimesForToday = (medication: Medication): string[] => {
  const scheduleType = medication.scheduleType || 'daily';

  if (scheduleType === 'morningEvening' && medication.times && medication.times.length >= 2) {
    return medication.times;
  }

  return [medication.time];
};

/**
 * İlacın bugün kaç kez alınması gerektiğini döndürür
 */
export const getMedicationCountForToday = (medication: Medication): number => {
  if (!shouldTakeMedicationToday(medication)) {
    return 0;
  }
  return getMedicationTimesForToday(medication).length;
};
