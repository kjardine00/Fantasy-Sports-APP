'use client';

import React from 'react'
import { useAuthModal } from '../../Auth/AuthModalContext';

const AuthButtons = () => {
  const { openAuthModal } = useAuthModal();
    
  return (
    <div>
        <button className="btn btn-primary text-lg rounded px-4" onClick={() => {openAuthModal('login')}}>Log In</button>
 
           <button className="btn btn-secondary text-lg rounded px-4" onClick={() => {openAuthModal('register')}}>Sign Up</button>
    </div>
  )
    
}

export default AuthButtons