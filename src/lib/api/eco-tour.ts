import { apiClient } from "./client";
import { EcoTourCourse, EcoTourCourseSummary } from "@/types";
import { PaginationParams, PaginatedResponse } from "@/types/api";

// 에코 투어 코스 관련 API
export const ecoTourApi = {
  // 모든 에코 투어 코스 조회
  getCourses: (
    areaId?: number,
    sigunguId?: number,
    categoryId?: number,
    tags?: string[]
  ) => {
    const searchParams = new URLSearchParams();
    if (areaId) searchParams.append("areaId", areaId.toString());
    if (sigunguId) searchParams.append("sigunguId", sigunguId.toString());
    if (categoryId) searchParams.append("categoryId", categoryId.toString());
    if (tags && tags.length > 0) {
      tags.forEach((tag) => searchParams.append("tags", tag));
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/courses?${queryString}` : `/courses`;

    return apiClient.get<{ courses: EcoTourCourseSummary[] }>(endpoint);
    //
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
