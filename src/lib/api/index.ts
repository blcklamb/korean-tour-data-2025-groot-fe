// API 모듈 통합 내보내기
export { apiClient } from "./client";

// 각 도메인별 API 서비스 내보내기
export * from "./location";
export * from "./carbon";
export * from "./eco-tour";
export * from "./user";

// 인증 관련 API (필요시 추가)
export const authApi = {
  // 로그인
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login: (credentials: { email: string; password: string }) => {
    // 실제 구현 시 추가
    return Promise.resolve({ token: "mock-token", user: {} });
  },

  // 로그아웃
  logout: () => {
    // 토큰 제거 등
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
    return Promise.resolve();
  },

  // 토큰 갱신
  refreshToken: () => {
    // 실제 구현 시 추가
    return Promise.resolve({ token: "new-mock-token" });
  },
};
