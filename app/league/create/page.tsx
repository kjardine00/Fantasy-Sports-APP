import React from "react";
import CreateLeagueClient from "./CreateLeagueClient";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const CreateLeaguePage = async () => {
  return <CreateLeagueClient />;
};

export default CreateLeaguePage;
