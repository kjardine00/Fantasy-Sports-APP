'use client';

import React from 'react'
import { useAuthModal } from '../../Auth/AuthModalContext';

const AuthButtons = () => {
  const { openAuthModal } = useAuthModal();
    
  return (
    <div className="flex items-center gap-2">
        <button
          className="btn btn-primary btn-md rounded-full px-4 shadow-sm hover:shadow"
          onClick={() => {openAuthModal('login')}}
        >
          Log In
        </button>
        <button
          className="btn btn-outline btn-secondary btn-md rounded-full px-4"
          onClick={() => {openAuthModal('register')}}
        >
          Sign Up
        </button>
    </div>
  )
    
}

export default AuthButtons