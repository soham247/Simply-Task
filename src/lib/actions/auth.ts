"use server";

import { createEmailSession, createAccount } from "@/lib/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppwriteException, OAuthProvider } from "node-appwrite";
import { account } from "../server/appwrite";

interface FormState {
  success: boolean;
  error?: string;
  message?: string;
}

async function signInWithEmailAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      success: false,
      error: "Email and password are required",
    };
  }

  try {
    const res = await createEmailSession(email, password);

    if (res.success) {
      // Redirect on success
      redirect("/dashboard");
    } else {
      return {
        success: false,
        error: "Sign in failed. Please try again.",
      };
    }
  } catch (error: unknown) {
    if (error instanceof AppwriteException) {
      return {
        success: false,
        error: error.message,
      };
    } else {
      return {
        success: false,
        error: "Sign in failed. Please try again.",
      };
    }
  }
}
async function signUpWithEmailAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  // Type safety: Validate required fields
  if (!email || !password || !name) {
    return {
      success: false,
      error: "Email, password, and name are required",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      error: "Password must be at least 8 characters long",
    };
  }

  try {
    const res = await createAccount(email, password, name);

    if (res.success) {
      // Redirect on success
      redirect("/signin");
    } else {
      return {
        success: false,
        error: "Account creation failed. Please try again.",
      };
    }
  } catch (error: unknown) {
    // Check if it's a Next.js redirect error (this is expected behavior)
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.includes("NEXT_REDIRECT")
    ) {
      // Re-throw redirect errors as they are expected
      throw error;
    }

    console.error("Sign up error:", error);

    if (error instanceof AppwriteException) {
      return {
        success: false,
        error: error.message,
      };
    } else {
      return {
        success: false,
        error: "Account creation failed. Please try again.",
      };
    }
  }
}

async function signUpWithGithub() {
  const origin = (await headers()).get("origin");
  
	const redirectUrl = await account.createOAuth2Token(
		OAuthProvider.Github,
		`${origin}/api/oauth`,
		`${origin}/signup`,
	);

	return redirect(redirectUrl);
};

export { signInWithEmailAction, signUpWithEmailAction, signUpWithGithub };
