"use client";

import { login } from "@/lib/server_actions/auth_actions";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAlert } from "@/app/components/Alert/AlertContext";
import { AlertType } from "@/lib/types/alert_types";

interface LeagueData {
  name: string;
  numberOfTeams: number;
  useChemistry: boolean;
  duplicatePlayers: string;
}

const LoginPage = () => {
  const router = useRouter();
  const { addAlert } = useAlert();

  const [draftLeagueData, setDraftLeagueData] = useState<LeagueData | null>(
    null
  );

  useEffect(() => {
    const tempLeagueData = sessionStorage.getItem("tempLeagueData");
    if (tempLeagueData) {
      setDraftLeagueData(JSON.parse(tempLeagueData));
    }
  }, []);

  const handleLogin = async (formData: FormData) => {
    try {
      await login(formData);

      const draftLeagueData = sessionStorage.getItem("tempLeagueData");
      if (draftLeagueData) {
        sessionStorage.removeItem("tempLeagueData");
        router.push("/league/create");
      } else {
        router.push("/login");
      }
    } catch (error) {
      addAlert({
        message: "Login failed",
        type: AlertType.ERROR,
        duration: 2000,
      });
      sessionStorage.removeItem("tempLeagueData");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Login to Fantasy Sports</h2>

          {/* {draftLeagueData && (
            <div className="alert alert-info mb-4">
              <div>
                <h3 className="font-bold">Complete Your League Creation</h3>
                <p>You were creating a league called <strong>"{draftLeagueData.name}"</strong></p>
                <p>Log in to continue and finish creating your league.</p>
              </div>
            </div>
          )} */}

          <form className="space-y-4" action={handleLogin}>
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
              <button className="btn btn-primary rounded">
                {" "}
                {/* TODO: add error handling and error messages */}
                Log In
              </button>
              <Link href="/register" className="btn btn-secondary rounded">
                Don't have an account? Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
