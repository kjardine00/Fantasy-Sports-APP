"use client";

import { useState, useEffect } from 'react'
import { validateInviteToken } from '@/lib/server_actions/invitations_actions'
import { useAlert } from '@/app/components/Alert/AlertContext'
import { AlertType } from '@/lib/types/alert_types';

interface TokenValidatorProps {
    token: string
}

const TokenValidator = ({ token }: TokenValidatorProps) => {
    const [tokenStatus, setTokenStatus] = useState<'loading' | 'valid' | 'invalid' | 'expired' | 'max_uses_reached'>('loading');
    const { addAlert } = useAlert();

    useEffect(() => {
        validateToken(token);
    }, [token]);

    const validateToken = async (token: string) => {
        try {
            const { validationResult, error } = await validateInviteToken(token);
            switch (validationResult) {
                case 'valid':
                    setTokenStatus('valid');
                    break;
                case 'invalid':
                    setTokenStatus('invalid');
                    addAlert({
                        message: "This invite link is invalid",
                        type: AlertType.ERROR,
                        duration: 4000,
                    });
                    break;
                case 'expired':
                    addAlert({
                        message: "This invite link has expired",
                        type: AlertType.ERROR,
                        duration: 4000,
                    });
                    setTokenStatus('expired');
                    break;
                case 'max_uses_reached':
                    setTokenStatus('max_uses_reached');
                    addAlert({
                        message: "This league if full",
                        type: AlertType.WARNING,
                        duration: 3000,
                    });
                    break;
                case 'error':
                    addAlert({
                        message: "An error occurred validating the invite token",
                        type: AlertType.ERROR,
                        duration: 4000,
                    });
                    break;
            }
        } catch (error) {
            addAlert({
                message: "An error occurred validating the invite token",
                type: AlertType.ERROR,
                duration: 4000,
            });
        }
    }

    if (tokenStatus === 'loading') {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="card w-96 bg-base-100 shadow-xl">
                    <div className="card-body text-center">
                        <span className="loading loading-spinner loading-lg"></span>
                        <h2 className="card-title">Validating invite...</h2>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>TokenValidator</div>
    )
}

export default TokenValidator