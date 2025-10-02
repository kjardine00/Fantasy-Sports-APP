import React from "react";
import TestComponent from "./test-component";
import { createClient } from '@/lib/database/server';

import { getUserLeagues } from '@/lib/database/queries/leagues_queries';

const TestInvitePage = async() => {

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: userLeagues, error: userLeaguesError } =
    await getUserLeagues(user?.id || '');

  if (userLeaguesError) {
    console.error('Error fetching user leagues:', userLeaguesError);
    return null;
  }

  const testData = userLeagues;


    return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <h1 className="card-title">Test Page</h1>
          {testData?.map((league) => (
            <h2 className="text-m">{JSON.stringify(league)}</h2>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestInvitePage;
