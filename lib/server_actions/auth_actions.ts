"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/database/server";
import { createNewProfile } from "@/lib/server_actions/profile_actions";

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signup(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (name.length > 20) {
    return { error: "Name must be less than 20 characters" };
  }

  if (!email.includes("@")) {
    return { error: "Invalid email" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const { data: existingEmail } = await supabase
    .from("profiles")
    .select("email")
    .eq("email", email)
    .single();

  if (existingEmail) {
    return { error: "Email already taken" };
  }

  const { data: user, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/confirm`,
      data: {
        name: name,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!user.user) {
    return { error: "Failed to create user" };
  }

  const { data: profileData, error: profileError } = await createNewProfile(
    user.user.id,
    email,
    name
  );

  if (profileError) {
    const errorMessage =
      typeof profileError === "string" ? profileError : profileError.message;
    return { error: `Profile creation failed: ${errorMessage}` };
  }
  console.log("=== SIGNUP COMPLETED SUCCESSFULLY ===");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  
  revalidatePath("/", "layout");
  redirect("/");
}


export async function verifyAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { authenticated: !!user, userId: user?.id}
}