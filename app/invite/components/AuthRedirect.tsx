'use client'

import { useAuthModal } from '@/app/components/Auth/AuthModalContext';
import { useEffect } from 'react';

interface AuthRedirectProps {
  view: 'login' | 'register' | 'forgot-password';
  token?: string;
}

export default function AuthRedirect({ view, token }: AuthRedirectProps) {
  const { openAuthModal } = useAuthModal();

  useEffect(() => {
    openAuthModal(view, token);
  }, []);

  return null;
}
