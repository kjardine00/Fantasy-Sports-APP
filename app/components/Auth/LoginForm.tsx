"use client";

import { login } from "@/lib/server_actions/auth_actions";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAlert } from "@/app/components/Alert/AlertContext";
import { AlertType } from "@/lib/types/alert_types";
import { useAuthModal } from "./AuthModalContext";

interface LeagueData {
    name: string;
    numberOfTeams: number;
    useChemistry: boolean;
    duplicatePlayers: string;
}

const LoginForm = () => {
    const router = useRouter();
    const [draftLeagueData, setDraftLeagueData] = useState<LeagueData | null>(
        null
    );
    const [inviteToken, setInviteToken] = useState<string | null>(null);
    const { switchView } = useAuthModal();
    const { addAlert } = useAlert();

    useEffect(() => {
        const tempLeagueData = sessionStorage.getItem("tempLeagueData");
        if (tempLeagueData) {
            setDraftLeagueData(JSON.parse(tempLeagueData));
        }
        const inviteToken = sessionStorage.getItem("inviteToken");
        if (inviteToken) {
            setInviteToken(inviteToken);
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
        <div className="flex items-center justify-center">
            <div className="card w-96 h-[500px] bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl mb-4">Login to Fantasy Sports</h2>

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
                            <button className="btn btn-secondary rounded" onClick={() => { switchView('register') }}
                            >
                                Don't have an account? Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginForm