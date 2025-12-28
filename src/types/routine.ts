export type RoutineRepeatType = 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'custom';

export interface SubTask {
  id: string;
  task: string;
  completed: boolean;
}

export interface Routine {
  id: string;
  title: string;
  description?: string;
  time: string; // Format: "HH:mm"
  repeatType: RoutineRepeatType;
  repeatDays?: string[]; // ['Monday', 'Wednesday', ...] - custom ve weekly için
  subTasks: SubTask[];
  notificationId?: string;
  color?: string; // İsteğe bağlı renk kodu
}

export interface RoutineContextType {
  routines: Routine[];
  addRoutine: (routine: Omit<Routine, 'id' | 'notificationId'>) => Promise<void>;
  updateRoutine: (id: string, routine: Partial<Routine>) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;
  loadRoutines: () => Promise<void>;
}

export interface DailyRoutineRecord {
  date: string; // Format: "YYYY-MM-DD"
  routines: {
    routineId: string;
    routineTitle: string;
    time: string;
    completed: boolean;
    completedAt?: string; // ISO timestamp
    subTasks: {
      subTaskId: string;
      task: string;
      completed: boolean;
    }[];
  }[];
}

