import { createClient } from "@/lib/database/server";
import AuthRedirect from "../components/AuthRedirect";
import TokenValidator from "../components/TokenValidator";

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
    return await ( <AuthRedirect view="login" token={params.token} />);
  }

  // If user is authenticated, show the token validator and join league option
  return await ( <TokenValidator token={params.token} />);
}
