import { apiClient } from "./client";
import { Location, Category } from "@/types";
import { PaginationParams, PaginatedResponse } from "@/types/api";

// 위치/관광지 관련 API
export const locationApi = {
  // 시도 목록 조회
  getLocations: () => {
    return apiClient.get<PaginatedResponse<Location>>(
      `/courses/locations/areas`
    );
  },

  // 특정 위치 조회
  getLocation: (id: string) => {
    return apiClient.get<Location>(`/locations/${id}`);
  },

  // 카테고리별 위치 조회
  getLocationsByCategory: (categoryId: string, params?: PaginationParams) => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    return apiClient.get<PaginatedResponse<Location>>(
      `/locations/category/${categoryId}?${searchParams.toString()}`
    );
  },

  // 근처 위치 조회
  getNearbyLocations: (lat: number, lng: number, radius: number = 5000) => {
    return apiClient.get<Location[]>(
      `/locations/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
    );
  },

  // 위치 검색
  searchLocations: (query: string, params?: PaginationParams) => {
    const searchParams = new URLSearchParams({ search: query });

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    return apiClient.get<PaginatedResponse<Location>>(
      `/locations/search?${searchParams.toString()}`
    );
  },

  // 인기 위치 조회
  getPopularLocations: (limit: number = 10) => {
    return apiClient.get<Location[]>(`/locations/popular?limit=${limit}`);
  },
};

// 카테고리 관련 API
export const categoryApi = {
  // 모든 카테고리 조회
  getCategories: () => {
    return apiClient.get<Category[]>("/categories");
  },

  // 특정 카테고리 조회
  getCategory: (id: string) => {
    return apiClient.get<Category>(`/categories/${id}`);
  },
};
