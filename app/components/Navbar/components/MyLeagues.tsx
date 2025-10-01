import Link from "next/link";
import React from "react";
import { getUserLeagues } from "@/lib/database/queries/leagues";
import { LeagueMember, League } from "@/lib/types/database";

const MyLeagues = async ({ userId }: { userId: string }) => {
  const { data: userLeagues, error: userLeaguesError } =
    await getUserLeagues(userId);

  return (
    <>
      {userLeagues?.map((member) => (
        <li key={member.league_id}>
          <Link href={`/league/${member.league_id}`}>
            {(member.leagues as any)?.name || 'Unnamed League'}
          </Link>
        </li>
      ))}
    </>
  );
    };

export default MyLeagues;
