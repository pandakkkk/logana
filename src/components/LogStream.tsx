import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import { useLogStore } from '../store/useLogStore';
import { LogEntry } from '../types/logTypes';

const LogStream: React.FC = () => {
  const logs = useLogStore((state) => state.logs);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return 'error';
      case 'warn':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Paper className="p-4 h-full">
      <Typography variant="h6" className="mb-4">
        Live Log Stream
      </Typography>
      <Box
        ref={containerRef}
        className="h-96 overflow-y-auto bg-gray-900 text-white p-4 rounded font-mono text-sm"
      >
        {logs.map((log: LogEntry) => (
          <Box key={log.id} className="mb-2 flex items-start gap-2">
            <Chip
              label={log.level}
              color={getLogLevelColor(log.level)}
              size="small"
              className="min-w-16"
            />
            <span className="text-gray-400 text-xs">{log.timestamp}</span>
            <span className="flex-1">{log.message}</span>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default LogStream;
