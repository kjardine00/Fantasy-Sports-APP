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

  if (!user) {
    return <AuthRedirect view="login" />;
  }

  if (user) {
    return <TokenValidator token={token} user={user} />;
  }
}
