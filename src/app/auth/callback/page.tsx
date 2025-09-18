"use client";

import { useKakaoLoginWithToken } from "@/hooks/queries";
import { exchangeKakaoTokenWithCode } from "@/lib/api/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useCallback } from "react";

function KakaoCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [hasProcessed, setHasProcessed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExchangePending, setIsExchangePending] = useState(false);

  const kakaoLoginWithToken = useKakaoLoginWithToken();

  const handleKakaoLogin = useCallback(
    async (code: string) => {
      try {
        setIsExchangePending(true);

        // 1단계: 코드를 access token으로 교환
        const tokenData = await exchangeKakaoTokenWithCode(code);

        // 2단계: access token으로 로그인
        await kakaoLoginWithToken.mutateAsync(tokenData.accessToken);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "로그인 중 오류가 발생했습니다.";
        setError(errorMessage);
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      } finally {
        setIsExchangePending(false);
      }
    },
    [kakaoLoginWithToken, router]
  );

  useEffect(() => {
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");

    // 이미 처리했거나 필요한 파라미터가 없으면 중단
    if (hasProcessed) return;

    // 사용자가 로그인을 취소한 경우
    if (errorParam) {
      setError("로그인이 취소되었습니다.");
      setHasProcessed(true);
      setTimeout(() => {
        router.replace("/login");
      }, 2000);
      return;
    }

    // authorization code가 없으면 에러
    if (!code) {
      setError("인증 코드를 받지 못했습니다.");
      setHasProcessed(true);
      setTimeout(() => {
        router.replace("/login");
      }, 2000);
      return;
    }

    // 카카오 로그인 API 호출 (code를 서버로 전달)
    handleKakaoLogin(code);
    setHasProcessed(true);
  }, [searchParams, hasProcessed, router, handleKakaoLogin]);

  // 로딩 중이거나 에러가 없을 때
  const isLoading = isExchangePending || kakaoLoginWithToken.isPending;

  if (!error && (isLoading || !hasProcessed)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">카카오 로그인 처리 중...</p>
        </div>
      </div>
    );
  }

  // 에러가 발생한 경우
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-xl font-semibold text-gray-900">로그인 오류</h1>
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-500">
            잠시 후 로그인 페이지로 이동합니다...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <p className="text-gray-600">로그인 성공! 메인 페이지로 이동 중...</p>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600">로딩 중...</p>
      </div>
    </div>
  );
}

export default function KakaoCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <KakaoCallbackContent />
    </Suspense>
  );
}
