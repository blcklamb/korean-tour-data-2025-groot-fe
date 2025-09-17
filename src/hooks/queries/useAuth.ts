import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  kakaoLogin,
  kakaoLoginWithCode,
  demoLogin,
  logout,
  getCurrentUser,
  updateProfile,
  tokenStorage,
} from "@/lib/api/auth";
import { queryKeys } from "@/lib/query-keys";
import {
  DemoLoginRequest,
  KakaoLoginRequest,
  LoginResponse,
  UpdateProfileRequest,
  User,
} from "@/types";

/**
 * 현재 사용자 정보 조회
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: getCurrentUser,
    enabled: tokenStorage.isAuthenticated(),
    retry: false,
  });
};

/**
 * 카카오 로그인 Mutation
 */
export const useKakaoLogin = (options?: {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: Error) => void;
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

      // 로그인 성공 후 리다이렉트 (추가 정보가 필요한지 확인)
      if (!data.user.birthYear || !data.user.gender || !data.user.address) {
        router.push("/onboarding");
      } else {
        router.push("/");
      }
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
export const useKakaoLoginWithCode = (options?: {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (code: string) => kakaoLoginWithCode(code),
    onSuccess: (data) => {
      // 토큰 저장
      tokenStorage.setToken(data.accessToken);

      // 사용자 정보 캐시에 저장
      queryClient.setQueryData(queryKeys.auth.me(), data.user);

      // 모든 쿼리 무효화 (새 로그인)
      queryClient.invalidateQueries();

      options?.onSuccess?.(data);

      // 로그인 성공 후 리다이렉트 (추가 정보가 필요한지 확인)
      if (!data.user.birthYear || !data.user.gender || !data.user.address) {
        router.push("/onboarding");
      } else {
        router.push("/");
      }
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
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: DemoLoginRequest) => demoLogin(data),
    onSuccess: (data) => {
      // 토큰 저장
      tokenStorage.setToken(data.accessToken);

      // 사용자 정보 캐시에 저장
      queryClient.setQueryData(queryKeys.auth.me(), data.user);

      // 모든 쿼리 무효화 (새 로그인)
      queryClient.invalidateQueries();

      options?.onSuccess?.(data);

      // 로그인 성공 후 메인 페이지로 이동
      router.push("/");
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
  const isAuthenticated = tokenStorage.isAuthenticated();

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isLoggedIn: isAuthenticated && !!user,
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
