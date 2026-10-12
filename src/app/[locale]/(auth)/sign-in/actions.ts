"use server";

import { AuthError } from "next-auth";
import { hasLocale } from "next-intl";
import { signIn, signOut } from "@/auth";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Server Actions can't read the route locale (next/root-params is route-only in
// Next 16), so the client passes it in and we validate it here.
function resolveLocale(locale: unknown) {
  return typeof locale === "string" && hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
}

export async function signInAction(
  email: string,
  password: string,
  locale: string,
  callbackUrl?: string,
) {
  try {
    await signIn("credentials", {
      email,
      password,
      // Only allow same-site relative paths (blocks "//evil.com" style redirects).
      // Falls back to the locale-aware home page ("/" for en, "/de" for de).
      redirectTo:
        callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
          ? callbackUrl
          : getPathname({ href: "/", locale: resolveLocale(locale) }),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "invalidCredentials" };
    }
    throw error;
  }
}

export async function signOutAction(formData: FormData) {
  const locale = resolveLocale(formData.get("locale"));
  // Locale-aware: "/sign-in" for en (default), "/de/sign-in" for de.
  await signOut({ redirectTo: getPathname({ href: "/sign-in", locale }) });
}
