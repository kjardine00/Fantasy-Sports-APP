'use client'

import { useAuthModal } from '@/app/components/Auth/AuthModalContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthRedirectProps {
  view: 'login' | 'register' | 'forgot-password';
}

export default function AuthRedirect({ view }: AuthRedirectProps) {
  const { openAuthModal, isOpen } = useAuthModal();
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) {
      // Open the auth modal with a callback to refresh the page after successful auth
      openAuthModal(view, {
        isDismissible: false,
        onAuthSuccess: () => {
          // Refresh the page to re-validate authentication
          router.refresh();
        }
      }); 
    }
  }, [view, openAuthModal, router, isOpen]);

  return null;
}
