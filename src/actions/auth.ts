"use server";

import { encodedRedirect } from "@/utils/utils";
// import { createClient } from "@/utils/supabase/server"; // Supabase authentication removed
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  // const supabase = await createClient(); // Supabase authentication removed. Placeholder for custom logic.

    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const error = { message: "Supabase authentication removed. Implement custom sign up logic here." }; // Placeholder for custom authentication logic - signUp

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  // const supabase = await createClient(); // Supabase authentication removed. Placeholder for custom logic.

  const { error } = { error: { message: "Supabase authentication removed. Implement custom sign in logic here." } };

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  // const supabase = await createClient(); // Supabase authentication removed. Placeholder for custom logic.
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = { error: { message: "Supabase authentication removed. Implement custom password reset logic here." } };

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  // const supabase = await createClient(); // Supabase authentication removed. Placeholder for custom logic.

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = { error: { message: "Supabase authentication removed. Implement custom user update logic here." } };

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  // const supabase = await createClient(); // Supabase authentication removed. Placeholder for custom logic.
  // await supabase.auth.signOut(); // Supabase authentication removed. Implement custom sign out logic here.
  return redirect("/sign-in");
};
