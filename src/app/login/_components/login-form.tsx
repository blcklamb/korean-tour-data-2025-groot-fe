"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDemoLogin } from "@/hooks/queries/useAuth";
import { Loader2 } from "lucide-react";
import KakaoLoginButton from "./kakao-login-button";
import { useSearchParams } from "next/navigation";
import { extractRedirectParam } from "@/lib/auth/redirect";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const redirectUrl = useMemo(
    () => extractRedirectParam(searchParams),
    [searchParams]
  );

  const demoLogin = useDemoLogin({
    redirectUrl,
    onError: (error) => {
      setError(error.message || "데모 로그인 중 오류가 발생했습니다.");
    },
  });

  const handleDemoLogin = () => {
    setError(null);
    demoLogin.mutate({
      email: "demo@example.com",
      password: "veryDifficultDemoPW1234",
    });
  };

  return (
    <>
      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-600 text-sm text-center">{error}</p>
        </div>
      )}

      {/* 로그인 버튼들 */}
      <div className="space-y-3">
        {/* 카카오 로그인 버튼 */}
        <KakaoLoginButton redirectUrl={redirectUrl ?? undefined} />

        {/* 데모 로그인 버튼 */}
        <Button
          onClick={handleDemoLogin}
          disabled={demoLogin.isPending}
          variant="outline"
          className="w-full"
          size="lg"
        >
          {demoLogin.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          데모 로그인
        </Button>
      </div>
    </>
  );
}
