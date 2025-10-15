"use client";

import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import LogoIcon from "@/components/ui/logo";
import LoginForm from "./_components/login-form";
import { useAuth } from "@/hooks/queries";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { isLoggedIn, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 하이드레이션이 완료되고 로그인된 상태라면 홈으로 리다이렉트
    if (isHydrated && isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn, isHydrated, router]);

  // 하이드레이션이 완료되지 않았다면 로딩 표시
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // 로그인된 사용자는 리다이렉트 중이므로 로딩 표시
  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }
  // 비로그인 사용자에게는 로그인 폼 표시
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md p-8 space-y-8">
        {/* 로고 및 타이틀 */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <LogoIcon width={64} height={64} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              그루트에 오신 것을 환영합니다
            </h1>
            <p className="text-gray-600 mt-2">
              친환경 여행으로 지구를 지켜보세요
            </p>
          </div>
        </div>

        {/* 로그인 폼 (Suspense로 감싸기) */}
        <Suspense fallback={<div className="text-center">로딩 중...</div>}>
          <LoginForm />
        </Suspense>

        {/* 추가 정보 */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            로그인하시면{" "}
            <a href="#" className="text-blue-600 hover:underline">
              서비스 약관
            </a>{" "}
            및{" "}
            <a href="#" className="text-blue-600 hover:underline">
              개인정보처리방침
            </a>
            에 동의하는 것으로 간주됩니다.
          </p>
        </div>
      </Card>
    </div>
  );
}
