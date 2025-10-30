"use client";

import { useState } from 'react'
import { sendLeagueInviteAction } from '@/lib/server_actions/invite_actions';

interface InviteCardProps {
    isVisible: boolean;
    onClose: () => void;
    leagueId: string;
    leagueName: string;
}

const InviteCard = ({ isVisible, onClose, leagueId, leagueName }: InviteCardProps) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleEmailInvite = async () => {
        if (!email) return;

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('leagueId', leagueId);

            console.log('Sending invite to:', email, 'for league:', leagueId);
            const result = await sendLeagueInviteAction(formData);
            console.log('Result:', result);

            if (result.error) {
                setMessage(`Error: ${result.error}`);
            } else {
                setMessage('Invitation sent successfully');
                setEmail('');
            }
        } catch (error) {
            console.error('Full error:', error);
            setMessage('Failed to send invitation');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-white/25 flex items-center justify-center z-50">
          <div className="card w-96 bg-base-100 card-xl shadow-sm relative">
            <button 
              className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2 z-10"
              onClick={onClose}
            >✕</button>
            <div className="card-body">
              <h2 className="card-title text-center">Invite friends to {leagueName}</h2>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email Address</span>
                </label>
                <input 
                  type="email" 
                  className="input input-bordered" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="friend@example.com"
                />
              </div>
    
              {message && (
                <div className="alert alert-info">
                  <span>{message}</span>
                </div>
              )}
    
              <div className="card-actions py-2">
                <button 
                  className="btn btn-primary w-full rounded-full"
                  onClick={handleEmailInvite}
                  disabled={isLoading || !email}
                >
                  {isLoading ? 'Sending...' : 'Send Email Invite'}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
}

export default InviteCard