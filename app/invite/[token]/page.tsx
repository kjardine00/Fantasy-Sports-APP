import { createClient } from "@/lib/database/server";
import AuthRedirect from "../components/AuthRedirect";

//TODO: Add Update invite page to handle generic tokens and show appropriate UI
//TODO: Add league capacity/max teams tracking to prevent overfilling
interface InvitePageProps {
  params: {
    token: string;
  };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user, show the auth redirect component which will open the modal
  if (!user) {
    return <AuthRedirect view="login" />;
  }

  // If user is authenticated, show the actual invite page content
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <h2 className="card-title text-success">Welcome!</h2>
          <p>You are authenticated and can now join the league.</p>
          <div className="card-actions justify-center">
            <a href="/" className="btn btn-primary">
              Go Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
