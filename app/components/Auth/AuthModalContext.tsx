"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react'

type AuthView = 'login' | 'register' | 'forgot-password';

interface AuthModalContextType {
    isOpen: boolean;
    currentView: AuthView;
    openAuthModal: (view: AuthView) => void;
    closeModal: () => void;
    switchView: (view: AuthView) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentView, setCurrentView] = useState<AuthView>('login');

    const openAuthModal = (view: AuthView) => {
        setCurrentView(view);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const switchView = (view: AuthView) => {
        setCurrentView(view);
    };

    return (
        <AuthModalContext.Provider value={{
            isOpen,
            currentView,
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