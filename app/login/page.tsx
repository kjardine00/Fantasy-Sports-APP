import { login, signup } from "@/lib/auth/actions";
import React from "react";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Login to Fantasy Sports</h2>
          
          <form className="space-y-4">
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                className="input input-bordered w-full"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="input input-bordered w-full"
                placeholder="Enter your password"
              />
            </div>
            
            <div className="card-actions justify-end space-x-2">
              <button 
                formAction={login} 
                className="btn btn-primary"
              >
                Log In
              </button>
              <button 
                formAction={signup} 
                className="btn btn-outline"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
