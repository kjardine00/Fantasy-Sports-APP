"use client";

import { logout } from '@/lib/server_actions/auth_actions'
import { useRouter } from 'next/navigation'
import { useAlert } from './Alert/AlertContext';
import { AlertType } from '@/lib/types/alert_types';

export default function LogoutButton() {
  const router = useRouter();
  const { addAlert } = useAlert();

  const handleLogout = async () => {
    addAlert({
      message: 'Log out successful',
      type: AlertType.INFO,
      duration: 2000,
    });
    sessionStorage.removeItem('tempLeagueData');
    
    await logout();
  };

  return (
    <button 
      onClick={handleLogout}
      className="btn btn-error"
    >
      Logout
    </button>
  )
}
