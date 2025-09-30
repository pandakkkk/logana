export interface LogEntry {
  id: string;
  timestamp: string;
  level: string;
  message: string;
}

export interface LogAnalytics {
  timestamps: string[];
  errors: number[];
  warnings: number[];
  info: number[];
}
