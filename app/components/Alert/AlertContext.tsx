"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Alert } from "@/lib/types/alert_types";

interface AlertContextType {
    alerts: Alert[]; 
    addAlert: (alert: Alert) => void;
    removeAlert: (id: string) => void;
    clearAllAlerts: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Fix the React.FC syntax - remove the extra braces and fix the typing
export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    const addAlert = (alert: Alert) => {
        const id = Math.random().toString(36).substring(2, 15);
        const newAlert = { ...alert, id };

        setAlerts([...alerts, newAlert]);

        if (alert.duration && alert.duration > 0) {
            setTimeout(() => {
                removeAlert(id);
            }, alert.duration);
        }
    };
    
    const removeAlert = (id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    const clearAllAlerts = () => {
        setAlerts([]);
    };

    // Fix the return statement and JSX syntax
    return (
        <AlertContext.Provider value={{ alerts, addAlert, removeAlert, clearAllAlerts }}>
            {children}
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};