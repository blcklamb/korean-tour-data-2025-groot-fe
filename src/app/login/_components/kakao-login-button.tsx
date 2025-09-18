"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const KAKAO_AUTH_ENDPOINT = "https://kauth.kakao.com/oauth/authorize";
const DEFAULT_REDIRECT_PATH = "/auth/callback";

export default function KakaoLoginButton({}) {
  const router = useRouter();
  const handleKakaoLogin = async () => {
    const clientId = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;

    if (!clientId) {
      console.error("Kakao REST API 키가 설정되지 않았습니다.");
      return;
    }

    if (typeof window === "undefined") {
      console.error("브라우저 환경에서만 사용할 수 있습니다.");
      return;
    }

    const redirectUri =
      process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ??
      `${window.location.origin}${DEFAULT_REDIRECT_PATH}`;

    const authorizationUrl = new URL(KAKAO_AUTH_ENDPOINT);
    authorizationUrl.searchParams.set("client_id", clientId);
    authorizationUrl.searchParams.set("redirect_uri", redirectUri);
    authorizationUrl.searchParams.set("response_type", "code");

    router.push(authorizationUrl.toString());
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
