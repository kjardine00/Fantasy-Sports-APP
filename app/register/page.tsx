import React from 'react'
import { signup } from '@/lib/auth/actions'

// Email, Username, Password, Confirm Password
const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Sign up to Fantasy Sports</h2>

          <form className="space-y-4">
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
                formAction={signup}
                className="btn btn-secondary rounded"
              >
                Sign Up
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage