import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const ProfilePage = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return <div>Hello you logged in and this is your profile page</div>;
};

export default ProfilePage;
