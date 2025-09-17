import { apiClient } from "./client";
import { Mission, Badge, User } from "@/types";
import { PaginationParams, PaginatedResponse } from "@/types/api";

// 미션 관련 API
export const missionApi = {
  // 사용자의 미션 조회
  getUserMissions: (
    userId: string,
    params?: PaginationParams & { completed?: boolean }
  ) => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.completed !== undefined)
      searchParams.append("completed", params.completed.toString());

    return apiClient.get<PaginatedResponse<Mission>>(
      `/users/${userId}/missions?${searchParams.toString()}`
    );
  },

  // 모든 미션 조회
  getAllMissions: (params?: PaginationParams & { type?: Mission["type"] }) => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.type) searchParams.append("type", params.type);

    return apiClient.get<PaginatedResponse<Mission>>(
      `/missions?${searchParams.toString()}`
    );
  },

  // 특정 미션 조회
  getMission: (id: string) => {
    return apiClient.get<Mission>(`/missions/${id}`);
  },

  // 미션 완료 처리
  completeMission: (userId: string, missionId: string) => {
    return apiClient.post<{ mission: Mission; pointsEarned: number }>(
      `/users/${userId}/missions/${missionId}/complete`
    );
  },

  // 미션 진행률 업데이트
  updateMissionProgress: (
    userId: string,
    missionId: string,
    progress: number
  ) => {
    return apiClient.patch<Mission>(
      `/users/${userId}/missions/${missionId}/progress`,
      { progress }
    );
  },
};

// 배지 관련 API
export const badgeApi = {
  // 사용자의 배지 조회
  getUserBadges: (userId: string) => {
    return apiClient.get<Badge[]>(`/users/${userId}/badges`);
  },

  // 모든 배지 조회
  getAllBadges: (category?: Badge["category"]) => {
    const searchParams = category
      ? new URLSearchParams({ category })
      : new URLSearchParams();
    return apiClient.get<Badge[]>(`/badges?${searchParams.toString()}`);
  },

  // 특정 배지 조회
  getBadge: (id: string) => {
    return apiClient.get<Badge>(`/badges/${id}`);
  },

  // 배지 해금 확인
  checkBadgeUnlock: (userId: string) => {
    return apiClient.post<{ unlockedBadges: Badge[] }>(
      `/users/${userId}/badges/check`
    );
  },
};

// 사용자 관련 API
export const userApi = {
  // 사용자 프로필 조회
  getProfile: (userId: string) => {
    return apiClient.get<User>(`/users/${userId}`);
  },

  // 사용자 통계 조회
  getUserStats: (userId: string) => {
    return apiClient.get<{
      totalPoints: number;
      level: number;
      badgesCount: number;
      completedMissions: number;
      carbonSaved: number;
      calculationsCount: number;
    }>(`/users/${userId}/stats`);
  },

  // 사용자 레벨업 확인
  checkLevelUp: (userId: string) => {
    return apiClient.post<{
      leveledUp: boolean;
      newLevel?: number;
      rewards?: number;
    }>(`/users/${userId}/level-check`);
  },

  // 사용자 공유 기록 조회
  getShareHistory: (userId: string, params?: PaginationParams) => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    return apiClient.get<
      PaginatedResponse<{
        id: string;
        type: "calculation" | "course" | "badge";
        content: unknown;
        sharedAt: string;
        platform: string;
      }>
    >(`/users/${userId}/share-history?${searchParams.toString()}`);
  },
};
