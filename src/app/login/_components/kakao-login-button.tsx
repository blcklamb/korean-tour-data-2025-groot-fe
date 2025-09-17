"use client";

import { Button } from "@/components/ui/button";

const redirectUri = `http://localhost:3000/auth/callback`;

export default function KakaoLoginButton({}) {
  const handleKakaoLogin = async () => {
    try {
      // 카카오 SDK를 사용하여 액세스 토큰 획득
      // 실제 구현에서는 카카오 SDK 초기화가 필요합니다
      if (typeof window !== "undefined" && window.Kakao) {
        window.Kakao.Auth.authorize({
          redirectUri,
        });
      } else {
        // SDK가 로드되지 않은 경우 데모용으로 처리
        console.error(
          "카카오 SDK가 로드되지 않았습니다. 데모 로그인을 이용해주세요."
        );
      }
    } catch (error) {
      console.error("카카오 로그인 오류:", error);
      console.error("카카오 로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <Button
      onClick={handleKakaoLogin}
      className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-medium"
      size="lg"
    >
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 3C7.029 3 3 6.582 3 11c0 2.395 1.27 4.544 3.311 6.032L5.5 21l4.5-2.5c.66.1 1.32.15 2 .15 4.971 0 9-3.582 9-8s-4.029-8-9-8z"
          fill="currentColor"
        />
      </svg>
      카카오로 로그인
    </Button>
  );
}
