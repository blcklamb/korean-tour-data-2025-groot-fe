import { ROUTES } from "@/lib/routes";
import { User } from "@/types";

export const LOGIN_REDIRECT_PARAM = "redirectUrl";

export const normalizeRedirectUrl = (
  value?: string | null
): string | null => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed.startsWith("/")) {
    return null;
  }

  if (trimmed.startsWith("//")) {
    return null;
  }

  return trimmed;
};

export const sanitizeRedirectUrl = (
  value?: string | null,
  fallback: string = ROUTES.HOME
): string => {
  return normalizeRedirectUrl(value) ?? fallback;
};

export const buildLoginUrl = (
  redirectUrl: string,
  loginPath: string = ROUTES.LOGIN
): string => {
  const params = new URLSearchParams();
  params.set(LOGIN_REDIRECT_PARAM, redirectUrl);
  return `${loginPath}?${params.toString()}`;
};

export const resolvePostLoginDestination = (
  user: User,
  redirectUrl?: string | null
): string => {
  const needsOnboarding =
    !user.birthYear || !user.gender || !user.address;

  if (needsOnboarding) {
    return ROUTES.ONBOARDING;
  }

  const normalized = normalizeRedirectUrl(redirectUrl);
  return normalized ?? ROUTES.HOME;
};

export const extractRedirectParam = (
  searchParams: URLSearchParams | null | undefined
): string | null => {
  if (!searchParams) {
    return null;
  }

  return normalizeRedirectUrl(searchParams.get(LOGIN_REDIRECT_PARAM));
};
