export type CycleType = 'general' | 'menstrual'; // Genel aylık rutin veya regl döngüsü

export interface CycleSettings {
  isActive: boolean;
  cycleType: CycleType;
}

// Regl Döngüsü için
export interface MenstrualCycleData {
  lastPeriodDate: string; // Format: "YYYY-MM-DD"
  cycleLength: number; // Ortalama döngü uzunluğu (gün)
  periodLength: number; // Ortalama adet süresi (gün)
}

export interface CycleSymptom {
  date: string; // Format: "YYYY-MM-DD"
  mood?: 'happy' | 'sad' | 'anxious' | 'irritable' | 'calm';
  painLevel?: number; // 0-5 arası
  physicalSymptoms?: string[]; // ['acne', 'bloating', 'headache', ...]
  notes?: string;
}

export interface CycleRecord {
  date: string; // Format: "YYYY-MM-DD"
  symptoms?: CycleSymptom;
  periodStarted?: boolean;
  periodEnded?: boolean;
}

// Genel Aylık Rutinler için
export interface MonthlyGoal {
  id: string;
  title: string;
  description?: string;
  targetCount?: number; // Örn: 4 kitap
  currentCount?: number; // Örn: 2 kitap
  completed: boolean;
  month: string; // Format: "YYYY-MM"
}

export interface CycleContextType {
  // Settings
  settings: CycleSettings;
  setSettings: (settings: CycleSettings) => Promise<void>;
  
  // Menstrual Cycle
  menstrualData?: MenstrualCycleData;
  setMenstrualData: (data: MenstrualCycleData) => Promise<void>;
  cycleRecords: CycleRecord[];
  
  // Monthly Goals
  monthlyGoals: MonthlyGoal[];
  addMonthlyGoal: (goal: Omit<MonthlyGoal, 'id'>) => Promise<void>;
  updateMonthlyGoal: (id: string, goal: Partial<MonthlyGoal>) => Promise<void>;
  deleteMonthlyGoal: (id: string) => Promise<void>;
  
  // Cycle Records
  addCycleRecord: (record: CycleRecord) => Promise<void>;
  updateCycleRecord: (date: string, record: Partial<CycleRecord>) => Promise<void>;
  
  loadCycleData: () => Promise<void>;
}

