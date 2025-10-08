'use client';

import React, { useState, useEffect } from "react";
import { signup } from '@/lib/server_actions/auth_actions'
import { useRouter } from 'next/navigation';
import { useAuthModal } from "./AuthModalContext";

interface LeagueData {
  name: string;
  numberOfTeams: number;
  useChemistry: boolean;
  duplicatePlayers: string;
}

// Email, Username, Password, Confirm Password
//TODO: Fix layout of page and add the confirm password
const RegisterForm = () => {
  const router = useRouter();
  const [draftLeagueData, setDraftLeagueData] = useState<LeagueData | null>(null);
  const { switchView } = useAuthModal();

  useEffect(() => {
    const tempLeagueData = sessionStorage.getItem('tempLeagueData');
    if (tempLeagueData) {
      setDraftLeagueData(JSON.parse(tempLeagueData));
    }
  }, []);

  const handleSignup = async (formData: FormData) => {
    try {
      await signup(formData);

      const draftLeagueData = sessionStorage.getItem('tempLeagueData');
      if (draftLeagueData) {
        router.push('/league/create');
      } else {
        router.push('/register');
      }
    } catch (error) {
      console.error('Signup failed: ', error);
    }
  }
  
  
  return (
    <div className="flex items-center justify-center">
      <div className="card w-96 h-[500px] bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Sign up to Fantasy Sports</h2>

          <form className="space-y-4" action={handleSignup}>
            <div className="form-control">

              <label className="label" htmlFor="username">
                <span className="label-text">Username</span>
              </label>
              <input
                id="username"
                name="username"
                type="username"
                required
                className="input input-bordered w-full"
                placeholder=""
              />

              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input input-bordered w-full validator"
                placeholder=""
              />
              <div className="validator-hint">Enter valid email address</div>

              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input input-bordered w-full"
                placeholder=""
              />
            </div>
            {/* <div className="validator-hint">Enter valid password</div> */}

            <div className="card-actions justify-end space-x-2">
              <button
                 //TODO: add error handling and error messages and validation
                className="btn btn-secondary rounded"
              >
                Sign Up
              </button>
              <button 
                type="button"
                className="btn btn-primary rounded" 
                onClick={() => { switchView('login') }}
              >
                Already have an account? Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm;