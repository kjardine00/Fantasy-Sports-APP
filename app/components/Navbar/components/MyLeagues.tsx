import Link from "next/link";
import React from "react";
import { getUserLeagues } from "@/lib/database/queries/leagues";
import { League } from "@/lib/types/database";

const MyLeagues = async ({ userId }: { userId: string }) => {
  const { data: userLeagues, error: userLeaguesError } =
    await getUserLeagues(userId);

  if (userLeaguesError) {
    console.error('Error fetching user leagues:', userLeaguesError);
    return null;
  }

  if (!userLeagues || userLeagues.length === 0) {
    return null;
  }

  return (
    <>
      {userLeagues.map((member) => (
        <li key={member.league_id}>
          <Link href={`/league/${member.league_id}`}>
            {((member.leagues as unknown) as League)?.name || 'Unnamed League'}
          </Link>
        </li>
      ))}
    </>
  );
};

export default MyLeagues;
