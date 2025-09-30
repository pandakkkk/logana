import { LogEntry } from '../types/logTypes';

export const fetchLogs = async (): Promise<LogEntry[]> => {
  // Mock API call - replace with actual API endpoint
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          timestamp: new Date().toISOString(),
          level: 'info',
          message: 'Application started successfully',
        },
        {
          id: '2',
          timestamp: new Date().toISOString(),
          level: 'warn',
          message: 'High memory usage detected',
        },
      ]);
    }, 1000);
  });
};

export const streamLogs = (callback: (log: LogEntry) => void) => {
  // Mock WebSocket connection - replace with actual WebSocket
  const interval = setInterval(() => {
    const levels = ['info', 'warn', 'error'];
    const messages = [
      'Database query executed',
      'API request processed',
      'Cache miss detected',
      'User authentication successful',
    ];
    
    const log: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level: levels[Math.floor(Math.random() * levels.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
    };
    
    callback(log);
  }, 3000);

  return () => clearInterval(interval);
};
