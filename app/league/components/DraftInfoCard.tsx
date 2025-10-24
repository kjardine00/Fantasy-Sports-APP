"use client";

import React, { useState, useEffect } from 'react'
import { useLeague } from '../LeagueContext'
import { getDraftByLeagueIDAction } from '@/lib/server_actions/draft_actions'
import { Draft } from '@/lib/types/database_types';
import CountdownTimer from '@/app/components/DraftCountdown/CountdownTimer';

const DraftInfoCard = () => {
    const { league, isCommissioner, members } = useLeague();
    const [draft, setDraft] = useState<Draft | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDraft = async () => {
            if (!league.id) return;

            try {
                const result = await getDraftByLeagueIDAction(league.id);
                if (result.data) {
                    setDraft(result.data);
                }


            } catch (error) {
                console.error('Error fetching draft:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchDraft();
    }, [league.id]);

    const isLeagueFull = members.length >= league.settings?.numberOfTeams;
    const isDraftScheduled = draft?.scheduled_start ? true : false;
    const isDraftCompleted = league.draft_completed;

    if (loading) return <div>Loading...</div>;

    if (isDraftCompleted) return null;

    const renderCommisionerContent = () => {
        if (!isLeagueFull && !isDraftScheduled) {
            return (
                <>
                    <h2 className="text-xl font-bold text-error text-center w-full">You're league is not full and your draft has not been scheduled.</h2>
                    <div className="card-actions justify-evenly py-4">
                        <button className="btn rounded-full btn-primary flex-1 max-w-64">Invite Managers</button>
                        <button className="btn rounded-full btn-secondary flex-1 max-w-64">Schedule Draft</button>
                    </div>
                </>
            );
        }

        if (!isLeagueFull && isDraftScheduled) {
            return (
                <div className="flex w-full items-center justify-between gap-6 px-4">
                    <div className="flex-1 text-center">
                        <h2 className="text-xl font-bold text-error text-center w-full">Your League is not full</h2>
                        <h3 className="card-subtitle text-md">{members.length} out of {league.settings?.numberOfTeams} teams have managers</h3>
                        <div className="card-actions justify-center py-4">
                            <button className="btn rounded-full btn-primary flex-1 max-w-64">Invite Managers</button>
                        </div>
                    </div>
                    <div className="divider divider-horizontal"></div>
                    <div className="flex-1 text-center">
                        <h2 className="text-xl font-bold text-center w-full">Your Draft is scheduled for</h2>
                        <h3 className="card-subtitle">{draft?.scheduled_start ? new Date(draft.scheduled_start).toLocaleDateString() : 'Not scheduled'}</h3>
                    </div>
                </div>
            );
        }

        if (isLeagueFull && !isDraftScheduled) {
            return (
                <>
                    <h2 className="text-xl font-bold text-error text-center w-full">Your Draft has not yet been scheduled.</h2>
                    <div className="card-actions justify-evenly py-4">
                        <button className="btn rounded-full btn-primary flex-1 max-w-64">Schedule Draft</button>
                        <button className="btn rounded-full btn-secondary flex-1 max-w-64">Edit League Settings</button>
                    </div>
                </>
            );
        }

        if (isLeagueFull && isDraftScheduled) {
            return (
                <div className="flex flex-row items-center justify-between w-full gap-6 px-4 py-4">
                    <div className="flex flex-col items-start justify-center w-[40%] space-y-2">
                        <h2 className="text-base font-lg text-base-content whitespace-nowrap">Your {draft?.draft_order_type === 'snake' ? 'Snake' : 'Auction'} Draft is scheduled for</h2>
                        <h3 className="text-md font-bold text-base-content">{draft?.scheduled_start ? new Date(draft.scheduled_start).toLocaleDateString() : "Not scheduled"}</h3>
                        <div className="mt-2">
                            <button className="btn btn-sm rounded-full btn-secondary w-full">Edit League Settings</button>
                        </div>
                    </div>
                    <div className="flex items-center justify-center w-[60%]">
                        <CountdownTimer
                            targetDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                            className="scale-90"
                        />
                    </div>
                </div>
            );
        }

        return <div>Something went wrong</div>
    }

    const renderMemberContent = () => {
        if (!isLeagueFull && !isDraftScheduled) {
            return (
                <div>Not Ready</div>
            );
        }

        if (!isLeagueFull && isDraftScheduled) {
            return (
                <div>Not Ready</div>
            );
        }

        if (isLeagueFull && !isDraftScheduled) {
            return (
                <div>Not Ready</div>
            );
        }

        if (isLeagueFull && isDraftScheduled) {
            return (
                <div>Not Ready</div>
            );
        }

        return <div>Something went wrong</div>
    }

    return (
        <div>
            <div className="card card-border bg-base-200 w-full">
                <div className="card-body">

                    {isCommissioner
                        ? renderCommisionerContent() :
                        renderMemberContent()}
                </div>
            </div>
        </div>
    )
}

export default DraftInfoCard