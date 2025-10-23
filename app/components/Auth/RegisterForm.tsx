"use client";

import React, { useEffect, useActionState, useState } from "react";
import { signup } from "@/lib/server_actions/auth_actions";
import { useAuthModal } from "./AuthModalContext";

const RegisterForm = () => {
  const { switchView, closeModal, onAuthSuccess } = useAuthModal();
  const [state, formAction, isPending] = useActionState(signup, null);
  const [ isExecutingCallback, setIsExecutingCallback] = useState(false);

  useEffect(() => {
     if (state?.success) {
      if (onAuthSuccess) {
        setIsExecutingCallback(true);
        Promise.resolve(onAuthSuccess())
        .then(() => {

        })
        .catch((error) => {
          console.error("Error in onAuthSuccess callback:", error);
            setIsExecutingCallback(false);
        })
      } else {
        closeModal();
      }
    }
  }, [state?.success, closeModal, onAuthSuccess]);

  return (
    <div className="flex items-center justify-center">
      <div className="card w-96 h-[500px] bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">
            Sign up to Fantasy Sports
          </h2>

          <form className="space-y-4" action={formAction}>
            <div className="form-control">
              {state?.error && (
                <div className="alert alert-error">
                  <span>{state.error}</span>
                </div>
              )}

              <label className="label" htmlFor="name">
                <span className="label-text">Name</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input input-bordered w-full validator"
                pattern="^[a-zA-Z]+$"
                title="Must be only letters"
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
                // pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                placeholder=""
              />

              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input input-bordered w-full validator"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                placeholder=""
              />

              <label className="label" htmlFor="confirmPassword">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="input input-bordered w-full"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                placeholder=""
              />

              <div className="card-actions justify-end space-x-2">
                <button
                  type="submit"
                  className="btn btn-secondary rounded"
                  disabled={isPending || isExecutingCallback}
                >
                  {isPending || isExecutingCallback ? "Signing up..." : "Sign Up"}
                </button>

                <button
                  type="button"
                  className="btn btn-primary rounded"
                  onClick={() => {
                    switchView("login");
                  }}
                >
                  Already have an account? Log In
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
