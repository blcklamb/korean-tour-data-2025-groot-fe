"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { buildLoginUrl, sanitizeRedirectUrl } from "@/lib/auth/redirect";
import { ROUTES } from "@/lib/routes";
import { tokenStorage } from "@/lib/api/auth";

interface UseLoginRedirectOptions {
  redirectTo?: string | null;
}

export const useLoginRedirect = (options?: UseLoginRedirectOptions) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const redirectUrl = useMemo(() => {
    if (options?.redirectTo) {
      return sanitizeRedirectUrl(options.redirectTo);
    }

    if (!pathname) {
      return ROUTES.HOME;
    }

    const queryString = searchParams?.toString();
    const current = queryString ? `${pathname}?${queryString}` : pathname;

    return sanitizeRedirectUrl(current, ROUTES.HOME);
  }, [options?.redirectTo, pathname, searchParams]);

  const loginUrl = useMemo(() => buildLoginUrl(redirectUrl), [redirectUrl]);

  const goToLogin = useCallback(() => {
    router.push(loginUrl);
  }, [router, loginUrl]);

  const requireLogin = useCallback(() => {
    if (tokenStorage.isAuthenticated()) {
      return true;
    }

    goToLogin();
    return false;
  }, [goToLogin]);

  return {
    redirectUrl,
    loginUrl,
    goToLogin,
    requireLogin,
  };
};
