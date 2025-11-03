

export function useDraftChannel() {
    

    useEffect(() => {
        const supabase = createClient();
        const channel = supabase.channel(`draft-${draftId}`)
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'drafts',
            filter: `id=eq.${draftId}`
          }, (payload) => {
            // Update draft state in context
          })
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'draft_picks',
            filter: `draft_id=eq.${draftId}`
          }, (payload) => {
            // New pick made - refresh picks list
          })
          .on('postgres_changes', {
            event: '*', // INSERT, UPDATE, DELETE
            schema: 'public',
            table: 'draft_queues',
            filter: `draft_id=eq.${draftId}`
          }, (payload) => {
            // Queue changed - refresh if it's current user's queue
          })
          .subscribe();
    })
}