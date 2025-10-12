'use client'

import { useAuthModal } from '@/app/components/Auth/AuthModalContext';
import { useEffect } from 'react';

interface AuthRedirectProps {
  view: 'login' | 'register' | 'forgot-password';
}

export default function AuthRedirect({ view }: AuthRedirectProps) {
  const { openAuthModal } = useAuthModal();

  useEffect(() => {
    openAuthModal(view);
  }, [view, openAuthModal]);

  return null;
}
