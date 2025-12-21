export interface DailyRecord {
  date: string; // Format: "YYYY-MM-DD"
  medications: {
    medicationId: string;
    medicationName: string;
    time: string; // Format: "HH:mm"
    taken: boolean;
    takenAt?: string; // ISO timestamp
  }[];
  water: {
    time: string; // Format: "HH:mm"
    amount: number; // ml
    totalAmount: number; // ml - günlük toplam
  }[];
}

export interface DailyContextType {
  records: DailyRecord[];
  markMedicationTaken: (medicationId: string, date?: string) => Promise<void>;
  markWaterDrunk: (amount: number, date?: string) => Promise<void>;
  getTodayRecord: () => DailyRecord;
  getTotalWaterToday: () => number; // ml cinsinden
  loadRecords: () => Promise<void>;
}

