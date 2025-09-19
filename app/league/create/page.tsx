import React from "react";
import CreateLeagueClient from "./CreateLeagueClient";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const CreateLeaguePage = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  return <CreateLeagueClient />;
};

export default CreateLeaguePage;
