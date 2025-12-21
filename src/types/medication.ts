export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string; // Format: "HH:mm"
  days: 'everyday' | string[];
  notificationId?: string;
}

export interface MedicationContextType {
  medications: Medication[];
  addMedication: (medication: Omit<Medication, 'id' | 'notificationId'>) => Promise<void>;
  updateMedication: (id: string, medication: Partial<Medication>) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  loadMedications: () => Promise<void>;
}

