import { create } from 'zustand';
import { LogEntry, LogAnalytics } from '../types/logTypes';

interface LogStore {
  logs: LogEntry[];
  analytics: LogAnalytics;
  addLog: (log: LogEntry) => void;
  clearLogs: () => void;
  updateAnalytics: (analytics: Partial<LogAnalytics>) => void;
}

export const useLogStore = create<LogStore>((set) => ({
  logs: [],
  analytics: {
    timestamps: [],
    errors: [],
    warnings: [],
    info: [],
  },
  addLog: (log) =>
    set((state) => ({
      logs: [...state.logs, log],
    })),
  clearLogs: () => set({ logs: [] }),
  updateAnalytics: (analytics) =>
    set((state) => ({
      analytics: { ...state.analytics, ...analytics },
    })),
}));
