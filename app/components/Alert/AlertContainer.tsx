'use client';

import {useAlert} from './AlertContext';
import Alert from './Alert';

export const AlertContainer = () => {
    const { alerts, removeAlert } = useAlert();

    if (alerts.length === 0) return null;

    return (
        <div className="fixed top-16 right-4 z-50 w-full max-w-md p-10">
            <div className="space-y-2">
                {alerts.map((alert) => (
                    <Alert
                    key={alert.id}
                    error={alert.message}
                    type={alert.type}
                    />
                ))}
            </div>
        </div>
    );
};