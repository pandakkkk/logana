export type LogEntry = {
    timestamp: string;
    level: string;
    source: string;
    message: string;
    userId?: string;
    application?: string;
    details?: Record<string, any>;
  };
  