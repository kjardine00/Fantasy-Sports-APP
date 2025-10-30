"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { validateTokenAction, acceptInviteAction } from '@/lib/server_actions/invite_actions'
import { useAlert } from '@/app/components/Alert/AlertContext'
import { AlertType } from '@/lib/types/alert_types';
import { User } from '@supabase/supabase-js';

interface TokenValidatorProps {
    token: string
    user: User
}

const TokenValidator = ({ token, user }: TokenValidatorProps) => {
    const { addAlert } = useAlert();
    const router = useRouter();
    const [tokenStatus, setTokenStatus] = useState<'loading' | 'valid' | 'invalid' | 'expired' | 'max_uses_reached' | 'joined'>('loading');
    const [shortCode, setShortCode] = useState<string | null>(null);
    const [isJoining, setIsJoining] = useState(false);

    useEffect(() => {
        validateToken(token);
    }, [token]);

    const validateToken = async (token: string) => {
        try {
            const result = await validateTokenAction(token, user.id);
            if (result.shortCode) {
                setShortCode(result.shortCode);
            }

            if (result.validationResult.data === 'valid') {
                setTokenStatus('valid');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            
            switch (errorMessage) {
                case 'joined':
                    setTokenStatus('joined');
                    addAlert({
                        message: "You're already a member of this league!",
                        type: AlertType.INFO,
                        duration: 3000,
                    });
                    router.push(`/league/${shortCode}`);
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
                        message: "This league is full",
                        type: AlertType.WARNING,
                        duration: 3000,
                    });
                    break;
                default:
                    console.error('Error validating invite token:', error);
                    setTokenStatus('invalid');
                    addAlert({
                        message: "An error occurred validating the invite token",
                        type: AlertType.ERROR,
                        duration: 4000,
                    });
                    break;
            }
        }
    }

    const handleJoinLeague = async () => {
        setIsJoining(true);
        try {
            const result = await acceptInviteAction(token, user.id);
            router.push(`/league/${result.shortCode}`);
            addAlert({
                message: "Successfully joined the league!",
                type: AlertType.SUCCESS,
                duration: 3000,
            });
        } catch (error) {
            console.error('Error joining league:', error instanceof Error ? error.message : String(error));
            addAlert({
                message: "An error occurred joining the league",
                type: AlertType.ERROR,
                duration: 3000,
            });
            setIsJoining(false);
        }
    }

    if (tokenStatus === 'loading') {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="card w-120 bg-base-100 shadow-xl">
                    <div className="card-body text-center">
                        <span className="loading loading-spinner loading-lg"></span>
                        <h2 className="card-title">Validating invite...</h2>
                    </div>
                </div>
            </div>
        )
    }

    if (tokenStatus === 'joined') {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="card w-96 bg-base-100 shadow-xl">
                    <div className="card-body text-center">
                        <h2 className="card-title">Already a Member</h2>
                        <p>You're already a member of this league!</p>
                        <div className="card-actions justify-center gap-2">
                            {shortCode && (
                                <button 
                                    onClick={() => router.push(`/league/${shortCode}`)} 
                                    className="btn btn-primary"
                                >
                                    Go to League
                                </button>
                            )}
                            <Link href="/" className="btn btn-ghost">Go Home</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (tokenStatus !== 'valid') {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="card w-96 bg-base-100 shadow-xl">
                    <div className="card-body text-center">
                        <h2 className="card-title">Unable to join league</h2>
                        <p>{tokenStatus}</p>
                        <div className="card-actions justify-center">
                            <Link href="/" className="btn btn-primary">Go Home</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (tokenStatus === 'valid') {
        return ( 
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body text-center">
                    <h2 className="card-title">Join League</h2>
                    <p>You've been invited to join this league!</p>
                    <div className="card-actions justify-center">
                        <button 
                            onClick={handleJoinLeague} 
                            className="btn btn-primary"
                            disabled={isJoining}
                        >
                            {isJoining ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Joining...
                                </>
                            ) : (
                                'Join League'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default TokenValidator