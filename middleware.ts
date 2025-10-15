import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 로그인 페이지 접근 시 처리
  if (pathname === "/login") {
    // 쿠키에서 auth_token 확인
    const authToken = request.cookies.get("auth_token")?.value;

    if (authToken && authToken.trim() !== "") {
      // 토큰이 있으면 홈페이지로 리다이렉트
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login"],
};
