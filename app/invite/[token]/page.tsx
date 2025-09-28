import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { acceptInvitation } from "@/lib/api/invitations";

interface InvitePageProps {
  params: {
    token: string;
  }
}

export default async function InvitePage({ params }: InvitePageProps) {
  const supabase = await createClient();
  const {data: {user}} = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?invite=${params.token}`);
  }

  const {data, error} = await acceptInvitation(params.token, user.id);

  if (error) {
    console.log('Error type:', typeof error);
    console.log('Error content:', error);
    
    return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body text-center">
        <h2 className="card-title text-error">Unable to Join League</h2>
        <p>error occured</p>
        <div className="card-actions justify-center">
          <a href="/" className="btn btn-primary">Go Home</a>
        </div>
      </div>
    </div>
  </div>
  )
  }

  return redirect(`/league/${data.league_id}`);
}