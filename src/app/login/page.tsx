"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LogoIcon from "@/components/ui/logo";
import { useDemoLogin } from "@/hooks/queries/useAuth";
import { Loader2 } from "lucide-react";
import KakaoLoginButton from "./_components/kakao-login-button";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  const demoLogin = useDemoLogin({
    onError: (error) => {
      setError(error.message || "데모 로그인 중 오류가 발생했습니다.");
    },
  });

  const handleDemoLogin = () => {
    console.log("Demo Login Clicked");
    setError(null);
    demoLogin.mutate({
      email: "demo@example.com",
      password: "veryDifficultDemoPW1234",
    });
  };

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

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {/* 로그인 버튼들 */}
        <div className="space-y-3">
          {/* 카카오 로그인 버튼 */}
          <KakaoLoginButton />

          {/* 데모 로그인 버튼 */}
          <Button
            onClick={handleDemoLogin}
            disabled={demoLogin.isPending}
            variant="outline"
            className="w-full"
            size="lg"
          >
            {demoLogin.isPending && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            데모 로그인
          </Button>
        </div>

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
