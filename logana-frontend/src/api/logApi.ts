import { LogEntry } from '../types/logTypes'

export async function fetchLogs(): Promise<LogEntry[]> {
  const res = await fetch('/api/logs');
  return res.json();
}

