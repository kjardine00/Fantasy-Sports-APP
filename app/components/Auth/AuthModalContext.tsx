"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react'

type AuthView = 'login' | 'register' | 'forgot-password';

interface AuthModalContextType {
    isOpen: boolean;
    isDismissible: boolean;
    currentView: AuthView;
    onAuthSuccess?: () => void | Promise<void>;  // ADD THIS
    openAuthModal: (view: AuthView, options?: { isDismissible?: boolean; onAuthSuccess?: () => void | Promise<void> }) => void;  // UPDATE THIS
    closeModal: () => void;
    switchView: (view: AuthView) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentView, setCurrentView] = useState<AuthView>('login');
    const [isDismissible, setIsDismissible] = useState(true);
    const [onAuthSuccess, setOnAuthSuccess] = useState<(() => void | Promise<void>) | undefined>(undefined);  // ADD THIS

    const openAuthModal = (view: AuthView, options?: { isDismissible?: boolean; onAuthSuccess?: () => void | Promise<void> }) => {
        setCurrentView(view);
        setIsOpen(true);
        setIsDismissible(options?.isDismissible ?? true);
        // Wrap in function to preserve the callback reference
        setOnAuthSuccess(() => options?.onAuthSuccess);  // ADD THIS
    };

    const closeModal = () => {
        setIsOpen(false);
        setOnAuthSuccess(undefined);  // ADD THIS - Clear callback when closing
    };

    const switchView = (view: AuthView) => {
        setCurrentView(view);
    };

    return (
        <AuthModalContext.Provider value={{
            isOpen,
            isDismissible,
            currentView,
            onAuthSuccess,  // ADD THIS
            openAuthModal,
            closeModal,
            switchView
        }}>
            {children}
        </AuthModalContext.Provider>
    )

};

export const useAuthModal = () => {
    const context = useContext(AuthModalContext);
    if (!context) {
        throw new Error('useAuthModal must be used within an AuthModalProvider');
    }
    return context;
}