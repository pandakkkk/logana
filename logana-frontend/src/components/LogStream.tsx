import React from 'react'
import { useLogStore, LogEntry, LogState } from '../store/useLogStore'

const LogStream: React.FC = () => {
  const logs = useLogStore((state: LogState) => state.logs)
  return (
    <div className="p-4 bg-gray-50 rounded shadow">
      <h2 className="font-bold text-lg mb-2">Live Log Stream</h2>
      <ul>
        {logs.map((log: LogEntry, idx: number) => (
          <li key={idx} className="mb-1 text-xs">
            <span className="font-mono text-blue-600">{log.timestamp}</span> -
            <span className="font-bold text-gray-800">{log.level}</span> -
            <span>{log.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LogStream
