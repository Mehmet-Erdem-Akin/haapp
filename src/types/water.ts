export interface WaterReminder {
  id: string;
  time: string; // Format: "HH:mm"
  amount: number; // ml cinsinden
  notificationId?: string;
}

export interface WaterContextType {
  reminders: WaterReminder[];
  waterGoal: number;
  setWaterGoal: (goal: number) => Promise<void>;
  addReminder: (reminder: Omit<WaterReminder, 'id' | 'notificationId'>) => Promise<void>;
  addBulkReminders: (reminders: Omit<WaterReminder, 'id' | 'notificationId'>[]) => Promise<void>;
  updateReminder: (id: string, reminder: Partial<WaterReminder>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  loadReminders: () => Promise<void>;
}

