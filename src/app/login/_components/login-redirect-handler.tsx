"use client";

import { useAuth } from "@/hooks/queries";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { tokenStorage } from "@/lib/api/auth";

interface LoginRedirectHandlerProps {
  onCanShowLogin: (canShow: boolean) => void;
}

export default function LoginRedirectHandler({
  onCanShowLogin,
}: LoginRedirectHandlerProps) {
  const { isLoggedIn, isHydrated } = useAuth();
  const router = useRouter();

  // 즉시 토큰 확인
  useEffect(() => {
    const hasToken =
      typeof window !== "undefined" && tokenStorage.isAuthenticated();
    if (hasToken) {
      // 토큰이 있으면 즉시 리다이렉트
      router.replace("/");
    } else {
      // 토큰이 없으면 로그인 페이지 표시 허용
      onCanShowLogin(true);
    }
  }, [router, onCanShowLogin]);

  // 하이드레이션 후 추가 체크
  useEffect(() => {
    if (isHydrated && isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn, isHydrated, router]);

  return null;
}
