"use client";

import { useEffect } from 'react';
import { createClient } from '@/lib/database/client';
import { useDraft } from '../context/DraftContext';

export function useDraftChannel() {
  const { draft, refreshDraft, currentUserId, isLoading } = useDraft();
  const draftId = draft?.id;

  useEffect(() => {
    // Don't try to connect if draft is still loading or no draft ID
    if (isLoading || !draftId) return;

    const supabase = createClient();
    // This creates the listeners on the channel `draft-${draftId}`
    const channel = supabase.channel(`draft-${draftId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'drafts',
        filter: `id=eq.${draftId}`
      }, (payload) => {
        console.log('Draft updated: ', payload.new)
        refreshDraft()
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'draft_picks',
        filter: `draft_id=eq.${draftId}`
      }, (payload) => {
        console.log('New pick made: ', payload.new)
        // Refresh draft (which will also refresh picks if your context does that)
        // OR you could update picks state here if you have separate picks state
        refreshDraft()
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Connected to draft channel');
        } else if (status === 'CHANNEL_ERROR') {
          // Don't log as error - this is often transient and will retry
          // Supabase will automatically retry the connection
          console.warn('⚠️ Draft channel connection issue (will retry)');
        }
      });

    // Cleanup function - runs when component unmounts or dependencies change
    return () => {
      console.log('🔴 Cleaning up draft channel...');
      supabase.removeChannel(channel);
    };
  }, [draftId, refreshDraft, currentUserId, isLoading])
}