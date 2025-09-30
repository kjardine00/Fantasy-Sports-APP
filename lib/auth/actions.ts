"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/database/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  const { data: user, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Error signing up: ", error);
    redirect("/error");
  }

  if (user.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      auth_id: user.user.id,
      username: username,
      role: "user",
    });

    if (profileError) {
      console.error("Error creating profile: ", profileError);
    }

    revalidatePath("/", "layout");
    redirect("/");
  }
}

export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}
