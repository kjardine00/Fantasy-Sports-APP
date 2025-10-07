"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react'

type AuthView = 'login' | 'register' | 'forgot-password';

interface AuthModalContextType {
    isOpen: boolean;
    currentView: AuthView;
    inviteToken: string | null;
    openAuthModal: (view: AuthView, token?: string) => void;
    closeModal: () => void;
    switchView: (view: AuthView) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentView, setCurrentView] = useState<AuthView>('login');
    const [inviteToken, setInviteToken] = useState<string | null>(null);

    const openAuthModal = (view: AuthView, token?: string) => {
        setCurrentView(view);
        setInviteToken(token || null);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setInviteToken(null);
    };

    const switchView = (view: AuthView) => {
        setCurrentView(view);
    };

    return (
        <AuthModalContext.Provider value={{
            isOpen,
            currentView,
            inviteToken,
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