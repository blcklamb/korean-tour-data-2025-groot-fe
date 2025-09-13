import { apiClient } from "./client";
import { EcoTourCourse } from "@/types";
import { PaginationParams, PaginatedResponse } from "@/types/api";

// 에코 투어 코스 관련 API
export const ecoTourApi = {
  // 모든 에코 투어 코스 조회
  getCourses: (
    params?: PaginationParams & {
      difficulty?: EcoTourCourse["difficulty"];
      maxDuration?: number;
      minRating?: number;
    }
  ) => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.difficulty)
      searchParams.append("difficulty", params.difficulty);
    if (params?.maxDuration)
      searchParams.append("maxDuration", params.maxDuration.toString());
    if (params?.minRating)
      searchParams.append("minRating", params.minRating.toString());

    return apiClient.get<PaginatedResponse<EcoTourCourse>>(
      `/eco-tours?${searchParams.toString()}`
    );
  },

  // 특정 에코 투어 코스 조회
  getCourse: (id: string) => {
    return apiClient.get<EcoTourCourse>(`/eco-tours/${id}`);
  },

  // 추천 에코 투어 코스 조회
  getRecommendedCourses: (userId?: string, limit: number = 5) => {
    const searchParams = new URLSearchParams({ limit: limit.toString() });
    if (userId) searchParams.append("userId", userId);

    return apiClient.get<EcoTourCourse[]>(
      `/eco-tours/recommended?${searchParams.toString()}`
    );
  },

  // 인기 에코 투어 코스 조회
  getPopularCourses: (limit: number = 10) => {
    return apiClient.get<EcoTourCourse[]>(`/eco-tours/popular?limit=${limit}`);
  },

  // 난이도별 코스 조회
  getCoursesByDifficulty: (
    difficulty: EcoTourCourse["difficulty"],
    params?: PaginationParams
  ) => {
    const searchParams = new URLSearchParams({ difficulty });

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    return apiClient.get<PaginatedResponse<EcoTourCourse>>(
      `/eco-tours/difficulty/${difficulty}?${searchParams.toString()}`
    );
  },

  // 코스 검색
  searchCourses: (query: string, params?: PaginationParams) => {
    const searchParams = new URLSearchParams({ search: query });

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    return apiClient.get<PaginatedResponse<EcoTourCourse>>(
      `/eco-tours/search?${searchParams.toString()}`
    );
  },
};
