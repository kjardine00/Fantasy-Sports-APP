'use client'

import { useAuthModal } from '@/app/components/Auth/AuthModalContext';
import { useEffect } from 'react';

interface AuthRedirectProps {
  view: 'login' | 'register' | 'forgot-password';
}

export default function AuthRedirect({ view }: AuthRedirectProps) {
  const { openAuthModal, isOpen } = useAuthModal();

  useEffect(() => {
    if (!isOpen) {
      openAuthModal(view, false); 
    }
  }, [view, openAuthModal]);

  return null;
}
