import { createClient } from "@/lib/database/server";
import AuthRedirect from "../components/AuthRedirect";
import TokenValidator from "../components/TokenValidator";

interface InvitePageProps {
  params: {
    token: string;
  };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user, show the auth redirect component which will open the modal
  if (!user) {
    return <AuthRedirect view="login" />;
  }

  // If user is authenticated, show the token validator and join league option
  return <TokenValidator token={token} user={user} />;
}
