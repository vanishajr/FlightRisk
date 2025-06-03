
import React, { createContext, useContext, useState } from 'react';

export type Alert = {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: Date;
  from: string;
};

interface AlertContextType {
  alerts: Alert[];
  addAlert: (message: string, severity: 'info' | 'warning' | 'critical', from?: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      message: 'Welcome aboard! We are currently experiencing smooth flying conditions.',
      severity: 'info',
      timestamp: new Date(),
      from: 'Captain'
    }
  ]);

  const addAlert = (message: string, severity: 'info' | 'warning' | 'critical', from: string = 'Captain') => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      message,
      severity,
      timestamp: new Date(),
      from
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
