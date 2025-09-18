import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import { userApi, missionApi, badgeApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { User, Mission, Badge, UpdateProfileRequest } from "@/types";
import { PaginationParams, PaginatedResponse, ApiError } from "@/types/api";

// 사용자 관련 Query Hooks
export const useUser = (
  userId: string,
  options?: Omit<UseQueryOptions<User, ApiError>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: () => userApi.getProfile(userId).then((res) => res.data),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 사용자 정보는 5분 동안 신선함
    ...options,
  });
};

export const useUpdateUserProfile = (
  options?: UseMutationOptions<User, ApiError, UpdateProfileRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => userApi.updateProfile(payload).then((res) => res.data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(data.id) });
      queryClient.setQueryData(queryKeys.auth.me(), data);
      options?.onSuccess?.(data, variables, context);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
};

export const useUserStats = (
  userId: string,
  options?: Omit<
    UseQueryOptions<
      {
        totalPoints: number;
        level: number;
        badgesCount: number;
        completedMissions: number;
        carbonSaved: number;
        calculationsCount: number;
      },
      ApiError
    >,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.users.stats(userId),
    queryFn: () => userApi.getUserStats(userId).then((res) => res.data),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 통계는 2분 동안 신선함
    ...options,
  });
};

export const useUserShareHistory = (
  userId: string,
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<
      PaginatedResponse<{
        id: string;
        type: "calculation" | "course" | "badge";
        content: unknown;
        sharedAt: string;
        platform: string;
      }>,
      ApiError
    >,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.users.shareHistory(userId, params),
    queryFn: () =>
      userApi.getShareHistory(userId, params).then((res) => res.data),
    enabled: !!userId,
    ...options,
  });
};

export const useCheckLevelUp = (
  options?: UseMutationOptions<
    { leveledUp: boolean; newLevel?: number; rewards?: number },
    ApiError,
    string
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) =>
      userApi.checkLevelUp(userId).then((res) => res.data),
    onSuccess: (data, userId) => {
      if (data.leveledUp) {
        // 사용자 정보와 통계 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: queryKeys.users.detail(userId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.users.stats(userId),
        });
      }
    },
    ...options,
  });
};

// 미션 관련 Query Hooks
export const useUserMissions = (
  userId: string,
  params?: PaginationParams & { completed?: boolean },
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Mission>, ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.missions.user(userId, params),
    queryFn: () =>
      missionApi.getUserMissions(userId, params).then((res) => res.data),
    enabled: !!userId,
    staleTime: 60 * 1000, // 미션은 1분 동안 신선함
    ...options,
  });
};

export const useAllMissions = (
  params?: PaginationParams & { type?: Mission["type"] },
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Mission>, ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.missions.list(params),
    queryFn: () => missionApi.getAllMissions(params).then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 전체 미션 목록은 5분 동안 신선함
    ...options,
  });
};

export const useMission = (
  id: string,
  options?: Omit<UseQueryOptions<Mission, ApiError>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: queryKeys.missions.detail(id),
    queryFn: () => missionApi.getMission(id).then((res) => res.data),
    enabled: !!id,
    ...options,
  });
};

// 미션 Mutation Hooks
export const useCompleteMission = (
  options?: UseMutationOptions<
    { mission: Mission; pointsEarned: number },
    ApiError,
    { userId: string; missionId: string }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, missionId }) =>
      missionApi.completeMission(userId, missionId).then((res) => res.data),
    onSuccess: (data, variables) => {
      // 미션 상세 정보 업데이트
      queryClient.setQueryData(
        queryKeys.missions.detail(variables.missionId),
        data.mission
      );

      // 사용자의 미션 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.missions.user(variables.userId),
      });

      // 사용자 통계 캐시 무효화 (포인트 업데이트)
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.stats(variables.userId),
      });
    },
    ...options,
  });
};

export const useUpdateMissionProgress = (
  options?: UseMutationOptions<
    Mission,
    ApiError,
    { userId: string; missionId: string; progress: number }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, missionId, progress }) =>
      missionApi
        .updateMissionProgress(userId, missionId, progress)
        .then((res) => res.data),
    onSuccess: (updatedMission, variables) => {
      // 미션 상세 정보 업데이트
      queryClient.setQueryData(
        queryKeys.missions.detail(variables.missionId),
        updatedMission
      );

      // 사용자의 미션 목록 캐시에서 해당 미션 업데이트
      queryClient.setQueryData(
        queryKeys.missions.user(variables.userId),
        (old: PaginatedResponse<Mission> | undefined) => {
          if (!old) return old;

          return {
            ...old,
            data: old.data.map((mission) =>
              mission.id === variables.missionId ? updatedMission : mission
            ),
          };
        }
      );
    },
    ...options,
  });
};

// 배지 관련 Query Hooks
export const useUserBadges = (
  userId: string,
  options?: Omit<UseQueryOptions<Badge[], ApiError>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: queryKeys.badges.user(userId),
    queryFn: () => badgeApi.getUserBadges(userId).then((res) => res.data),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 배지는 5분 동안 신선함
    ...options,
  });
};

export const useAllBadges = (
  category?: Badge["category"],
  options?: Omit<UseQueryOptions<Badge[], ApiError>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: queryKeys.badges.list(category),
    queryFn: () => badgeApi.getAllBadges(category).then((res) => res.data),
    staleTime: 10 * 60 * 1000, // 전체 배지 목록은 10분 동안 신선함
    ...options,
  });
};

export const useBadge = (
  id: string,
  options?: Omit<UseQueryOptions<Badge, ApiError>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: queryKeys.badges.detail(id),
    queryFn: () => badgeApi.getBadge(id).then((res) => res.data),
    enabled: !!id,
    ...options,
  });
};

// 배지 Mutation Hooks
export const useCheckBadgeUnlock = (
  options?: UseMutationOptions<{ unlockedBadges: Badge[] }, ApiError, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) =>
      badgeApi.checkBadgeUnlock(userId).then((res) => res.data),
    onSuccess: (data, userId) => {
      if (data.unlockedBadges.length > 0) {
        // 사용자 배지 목록 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: queryKeys.badges.user(userId),
        });

        // 사용자 통계 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: queryKeys.users.stats(userId),
        });
      }
    },
    ...options,
  });
};

// 사용자 프로그레스 통합 hook
export const useUserProgress = (userId: string) => {
  const userQuery = useUser(userId);
  const statsQuery = useUserStats(userId);
  const badgesQuery = useUserBadges(userId);
  const missionsQuery = useUserMissions(userId, { completed: false });

  return {
    user: userQuery.data,
    stats: statsQuery.data,
    badges: badgesQuery.data,
    activeMissions: missionsQuery.data?.data,
    isLoading:
      userQuery.isLoading ||
      statsQuery.isLoading ||
      badgesQuery.isLoading ||
      missionsQuery.isLoading,
    isError:
      userQuery.isError ||
      statsQuery.isError ||
      badgesQuery.isError ||
      missionsQuery.isError,
  };
};
