"use client";

import React, { useState, useEffect, useActionState } from "react";
import { login } from "@/lib/server_actions/auth_actions";
import { processInviteAfterAuth } from "@/lib/server_actions/invitations_actions";
import { useRouter } from "next/navigation";
import { useAuthModal } from "./AuthModalContext";

interface LeagueData {
  name: string;
  numberOfTeams: number;
  useChemistry: boolean;
  duplicatePlayers: string;
}

const LoginForm = () => {
  const router = useRouter();
  const { switchView, closeModal, inviteToken } = useAuthModal();
  const [state, formAction, isPending] = useActionState(login, null);
  
  const [draftLeagueData, setDraftLeagueData] = useState<LeagueData | null>(
    null
  );

  useEffect(() => {
    if (state?.success && inviteToken) {
      // Process the invite after successful login
      processInviteAfterAuth(inviteToken);
    } else if (state?.success) {
      const draftLeagueData = sessionStorage.getItem("tempLeagueData");
      if (draftLeagueData) {
        sessionStorage.removeItem("tempLeagueData");
        router.push("/league/create");
      } else {
        router.push("/");
      }
      closeModal();
    }
  }, [state?.success, inviteToken]);

  return (
    <div className="flex items-center justify-center">
      <div className="card w-96 h-[500px] bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Login to Fantasy Sports</h2>

          {state?.error && (
            <div className="alert alert-error">
              <span>{state.error}</span>
            </div>
          )}

          <form className="space-y-4" action={formAction}>
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

            <div className="card-actions flex justify-end space-x-2">
              <button
                type="submit"
                className="btn btn-primary rounded"
                disabled={isPending}
              >
                {" "}
                {/* TODO: add error handling and error messages */}
                {isPending ? "Logging in..." : "Log In"}
              </button>

              <button
                type="button"
                className="btn btn-secondary rounded"
                onClick={() => {
                  switchView("register");
                }}
              >
                Don't have an account? Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
