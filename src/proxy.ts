import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "./auth";

const intlMiddleware = createMiddleware(routing);

/** Detects the locale from the URL prefix; falls back to the default (en). */
function getLocaleFromPath(pathname: string) {
  return (
    routing.locales.find(
      (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
    ) ?? routing.defaultLocale
  );
}

/** Builds a locale-aware path: no prefix for the default locale ("as-needed"). */
function localizedPath(path: string, locale: string) {
  if (locale === routing.defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

// Matches /sign-in, /en/sign-in, /de/sign-in (with optional trailing slash).
const signInPattern = new RegExp(
  `^/(?:(?:${routing.locales.join("|")})/)?sign-in/?$`,
);

export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  const locale = getLocaleFromPath(pathname);
  const isSignIn = signInPattern.test(pathname);

  if (!req.auth && !isSignIn) {
    const signInUrl = new URL(localizedPath("/sign-in", locale), req.nextUrl);
    signInUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(signInUrl);
  }

  if (req.auth && isSignIn) {
    return NextResponse.redirect(new URL(localizedPath("/", locale), req.nextUrl));
  }

  // Let next-intl handle locale detection/prefix normalization (e.g. /en/... -> /...).
  return intlMiddleware(req);
});

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
