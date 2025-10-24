import { requireAuth } from "@/lib/contexts/UserContext";
import TokenValidator from "../components/TokenValidator";

interface InvitePageProps {
  params: {
    token: string;
  };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const { user, profile } = await requireAuth();
  
  return <TokenValidator token={token} user={user} />;
}
