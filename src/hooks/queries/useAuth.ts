import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  kakaoLogin,
  kakaoLoginWithToken,
  logout,
  getCurrentUser,
  updateProfile,
  tokenStorage,
  demoEmailLogin,
} from "@/lib/api/auth";
import { resolvePostLoginDestination } from "@/lib/auth/redirect";
import { queryKeys } from "@/lib/query-keys";
import {
  DemoLoginRequest,
  KakaoLoginRequest,
  LoginResponse,
  UpdateProfileRequest,
  User,
} from "@/types";
import { ApiError } from "@/types/api";

/**
 * 현재 사용자 정보 조회
 */
export const useCurrentUser = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setHasToken(tokenStorage.isAuthenticated());
    setIsHydrated(true);
  }, []);

  const query = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: getCurrentUser,
    enabled: isHydrated && hasToken, // 하이드레이션 후에만 실행
    retry: false,
  });

  // 401 에러 처리
  useEffect(() => {
    const error = query.error as unknown as ApiError;
    if (query.error && error.status === 401) {
      tokenStorage.removeToken();
      queryClient.clear();
      setHasToken(false); // 쿼리를 비활성화하기 위해 hasToken을 false로 설정
    }
  }, [query.error, queryClient]);

  // 토큰 상태 변화 감지 (다른 컴포넌트에서 토큰이 제거되었을 수도 있음)
  useEffect(() => {
    const checkTokenInterval = setInterval(() => {
      const currentHasToken = tokenStorage.isAuthenticated();
      if (currentHasToken !== hasToken) {
        setHasToken(currentHasToken);
      }
    }, 1000); // 1초마다 토큰 상태 확인

    return () => clearInterval(checkTokenInterval);
  }, [hasToken]);

  return query;
};

/**
 * 카카오 로그인 Mutation
 */
export const useKakaoLogin = (options?: {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: Error) => void;
  redirectUrl?: string | null;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (request: KakaoLoginRequest) => kakaoLogin(request),
    onSuccess: (data) => {
      // 토큰 저장
      tokenStorage.setToken(data.accessToken);

      // 사용자 정보 캐시에 저장
      queryClient.setQueryData(queryKeys.auth.me(), data.user);

      // 모든 쿼리 무효화 (새 로그인)
      queryClient.invalidateQueries();

      options?.onSuccess?.(data);

      const destination = resolvePostLoginDestination(
        data.user,
        options?.redirectUrl
      );

      router.push(destination);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

/**
 * 카카오 OAuth 코드로 로그인 Mutation
 * (콜백 페이지에서 사용)
 */
export const useKakaoLoginWithToken = (options?: {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: Error) => void;
  redirectUrl?: string | null;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (accessToken: string) => kakaoLoginWithToken(accessToken),
    onSuccess: (data) => {
      // 토큰 저장
      tokenStorage.setToken(data.accessToken);

      // 사용자 정보 캐시에 저장
      queryClient.setQueryData(queryKeys.auth.me(), data.user);

      // 모든 쿼리 무효화 (새 로그인)
      queryClient.invalidateQueries();

      options?.onSuccess?.(data);

      const destination = resolvePostLoginDestination(
        data.user,
        options?.redirectUrl
      );

      router.push(destination);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

/**
 * 데모 로그인 Mutation
 */
export const useDemoLogin = (options?: {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: Error) => void;
  redirectUrl?: string | null;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: DemoLoginRequest) => demoEmailLogin(data),
    onSuccess: (data) => {
      // 토큰 저장
      tokenStorage.setToken(data.accessToken);

      // 사용자 정보 캐시에 저장
      queryClient.setQueryData(queryKeys.auth.me(), data.user);

      // 모든 쿼리 무효화 (새 로그인)
      queryClient.invalidateQueries();

      options?.onSuccess?.(data);

      const destination = resolvePostLoginDestination(
        data.user,
        options?.redirectUrl
      );

      router.push(destination);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

/**
 * 프로필 업데이트 Mutation
 */
export const useUpdateProfile = (options?: {
  onSuccess?: (data: User) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (request: UpdateProfileRequest) => updateProfile(request),
    onSuccess: (data) => {
      // 사용자 정보 캐시 업데이트
      queryClient.setQueryData(queryKeys.auth.me(), data);

      // 프로필 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.profile(),
      });

      options?.onSuccess?.(data);

      // 프로필 업데이트 후 메인 페이지로 이동
      router.push("/");
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

/**
 * 로그아웃 Mutation
 */
export const useLogout = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // 토큰 제거
      tokenStorage.removeToken();

      // 모든 캐시 클리어
      queryClient.clear();

      options?.onSuccess?.();

      // 로그인 페이지로 이동
      router.push("/login");
    },
    onError: (error) => {
      // 에러가 발생해도 로컬 로그아웃은 수행
      tokenStorage.removeToken();
      queryClient.clear();
      router.push("/login");

      options?.onError?.(error);
    },
  });
};

/**
 * 인증 상태 확인 훅
 */
export const useAuth = () => {
  const { data: user, isLoading, error } = useCurrentUser();
  const [hasToken, setHasToken] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // 클라이언트에서만 토큰 확인
  useEffect(() => {
    setHasToken(tokenStorage.isAuthenticated());
    setIsHydrated(true);
  }, []);

  // 토큰 상태를 useCurrentUser의 에러 상태와 동기화
  useEffect(() => {
    const apiError = error as unknown as ApiError;
    if (error && apiError.status === 401) {
      setHasToken(false);
    }
  }, [error]);

  const isAuthenticated = (user as User)?.id !== undefined;

  return {
    user: user as User,
    isLoading: isLoading || !isHydrated, // 하이드레이션 전까지는 로딩 상태
    isHydrated,
    error,
    isAuthenticated,
    hasToken,
    // 하이드레이션 완료 후 토큰과 인증 상태 확인
    isLoggedIn: isHydrated && hasToken && (isLoading || isAuthenticated),
  };
};

/**
 * 인증이 필요한 페이지에서 사용하는 훅
 */
export const useRequireAuth = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  // 로딩이 끝나고 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isLoading && !isAuthenticated) {
    router.push("/login");
  }

  return {
    user,
    isLoading,
    isAuthenticated,
  };
};
