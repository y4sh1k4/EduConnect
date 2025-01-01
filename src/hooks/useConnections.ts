import { useState } from 'react';
import { User } from '../types';

export function useConnections() {
  const [connections, setConnections] = useState<{ [key: string]: boolean }>({});

  const handleConnection = (userId: string, isConnected: boolean) => {
    setConnections(prev => ({
      ...prev,
      [userId]: isConnected
    }));
  };

  const isConnected = (userId: string) => connections[userId] || false;

  return {
    connections,
    handleConnection,
    isConnected
  };
}