export type ScheduleType = 'daily' | 'everyXDays' | 'morningEvening' | 'weekly' | 'custom';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string; // Format: "HH:mm" - ana saat (daily ve everyXDays için)
  times?: string[]; // Format: ["HH:mm", "HH:mm"] - sabah/akşam veya çoklu saatler için
  days: 'everyday' | string[]; // Haftalık için ['Monday', 'Wednesday', ...]
  scheduleType: ScheduleType; // Zamanlama tipi
  intervalDays?: number; // 2 günde bir için 2
  notificationId?: string;
}

export interface MedicationContextType {
  medications: Medication[];
  addMedication: (medication: Omit<Medication, 'id' | 'notificationId'>) => Promise<void>;
  updateMedication: (id: string, medication: Partial<Medication>) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  loadMedications: () => Promise<void>;
}



