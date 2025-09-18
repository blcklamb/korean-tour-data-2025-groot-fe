import { apiClient } from "./client";
import {
  KakaoLoginRequest,
  LoginResponse,
  UpdateProfileRequest,
  LogoutResponse,
  User,
} from "@/types";

/**
 * 카카오 로그인
 */
export const kakaoLogin = async (
  request: KakaoLoginRequest
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/kakao", request);
  return response.data;
};

export type KakaoTokenExchangeResponse = {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  refreshTokenExpiresIn?: number;
  scope?: string;
  tokenType?: string;
};

export const exchangeKakaoTokenWithCode = async (
  code: string
): Promise<KakaoTokenExchangeResponse> => {
  const response = await fetch(`/api/kakao/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  const payload = await response.json();

  if (!response.ok) {
    const message =
      (payload && (payload.error_description || payload.error || payload.message)) ??
      "카카오 토큰 교환에 실패했습니다.";
    throw new Error(message);
  }

  return payload as KakaoTokenExchangeResponse;
};

/**
 * 카카오 OAuth 코드를 사용한 로그인
 * (서버에서 code를 accessToken으로 교환)
 */
export const kakaoLoginWithToken = async (
  accessToken: string
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/kakao", {
    accessToken,
  });
  return response.data;
};

/**
 * 회원 추가 정보 입력 (신규 사용자)
 */
export const updateProfile = async (
  request: UpdateProfileRequest
): Promise<User> => {
  const response = await apiClient.put<User>("/auth/profile", request);
  return response.data;
};

/**
 * 로그아웃
 */
export const logout = async (): Promise<LogoutResponse> => {
  const response = await apiClient.post<LogoutResponse>("/auth/logout");
  return response.data;
};

/**
 * 현재 사용자 정보 조회
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>("/users/profile");
  return response.data;
};

/**
 * 데모 이메일 로그인
 */
export const demoEmailLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/demo-login", {
    email,
    password,
  });
  return response.data;
};

// 토큰 관리 유틸리티 함수들
export const tokenStorage = {
  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  },

  setToken: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  },

  removeToken: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  },

  isAuthenticated: (): boolean => {
    return !!tokenStorage.getToken();
  },
};
