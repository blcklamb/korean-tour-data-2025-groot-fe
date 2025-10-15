"use client";

import { useAuth } from "@/hooks/queries";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginRedirectHandler() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      // 로그인되어 있으면 홈페이지로 리다이렉트
      router.replace("/");
    }
  }, [isLoggedIn, router]);

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
}
