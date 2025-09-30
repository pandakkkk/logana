import { create } from 'zustand';

export type LogEntry = {
  timestamp: string;
  level: string;
  source: string;
  message: string;
  userId?: string;
  application?: string;
};

export type LogState = {
  logs: LogEntry[];
  addLog: (log: LogEntry) => void;
};

export const useLogStore = create<LogState>((set) => ({
  logs: [],
  addLog: (log) => set((state) => ({ logs: [log, ...state.logs] })),
}));
