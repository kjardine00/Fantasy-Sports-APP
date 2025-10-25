import { getCurrentUser } from "@/lib/contexts/UserContext";
import TokenValidator from "../components/TokenValidator";
import AuthRedirect from "../components/AuthRedirect";

interface InvitePageProps {
  params: {
    token: string;
  };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const { user, isAuthenticated } = await getCurrentUser();
  
  // If user is not authenticated, show them a login/register prompt
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <h2 className="card-title text-2xl mb-4">League Invite</h2>
            <p className="mb-6">You've been invited to join a league! Please log in or create an account to continue.</p>
            <AuthRedirect view="login" />
          </div>
        </div>
      </div>
    );
  }
  
  return <TokenValidator token={token} user={user} />;
}
