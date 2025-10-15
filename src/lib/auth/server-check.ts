import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * 서버 컴포넌트에서 인증 상태를 확인하는 함수
 */
export async function checkAuthenticationStatus() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  return {
    isAuthenticated: !!(authToken && authToken.trim() !== ""),
    token: authToken || null,
  };
}

/**
 * 로그인된 사용자를 홈페이지로 리다이렉트하는 함수
 */
export async function redirectIfAuthenticated() {
  const { isAuthenticated } = await checkAuthenticationStatus();

  if (isAuthenticated) {
    redirect("/");
  }
}
