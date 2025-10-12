"use client";

import React, { useEffect } from 'react'
import { useAuthModal } from './AuthModalContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthModal = () => {
    const {
        isOpen,
        currentView,
        closeModal,
        switchView
    } = useAuthModal();

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            return () => document.removeEventListener('keydown', handleEsc);
        }
    }, [isOpen, closeModal]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/25"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
                onClick={closeModal}
            />

            <div className="relative z-10">
                {currentView === 'login' && <LoginForm />}
                {currentView === 'register' && <RegisterForm />}
                {/* {currentView === 'forgot-password' && <ForgotPasswordForm />} */}
            </div>
        </div>
    )
}

export default AuthModal