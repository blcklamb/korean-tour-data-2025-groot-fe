import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import LogoIcon from "@/components/ui/logo";
import LoginForm from "./_components/login-form";
import { redirectIfAuthenticated } from "@/lib/auth/server-check";
import LoginRedirectHandler from "./_components/login-redirect-handler";

export default async function LoginPage() {
  // 서버사이드에서 인증 상태 확인 후 리다이렉트
  await redirectIfAuthenticated();

  return (
    <>
      {/* 클라이언트사이드 백업 리다이렉트 (쿠키와 localStorage 동기화를 위해) */}
      <LoginRedirectHandler />

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
    </>
  );
}
