import { apiClient } from "./client";
import { CarbonCalculation, RouteData, AccommodationData } from "@/types";
import { PaginationParams, PaginatedResponse } from "@/types/api";

// 탄소 계산 관련 API
export const carbonApi = {
  // 탄소 계산 생성
  createCalculation: (data: {
    routes: Omit<RouteData, "id" | "carbon">[];
    accommodations: Omit<AccommodationData, "id" | "carbon">[];
  }) => {
    return apiClient.post<CarbonCalculation>("/carbon-calculations", data);
  },

  // 사용자의 탄소 계산 기록 조회
  getUserCalculations: (userId: string, params?: PaginationParams) => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    return apiClient.get<PaginatedResponse<CarbonCalculation>>(
      `/users/${userId}/carbon-calculations?${searchParams.toString()}`
    );
  },

  // 특정 탄소 계산 조회
  getCalculation: (id: string) => {
    return apiClient.get<CarbonCalculation>(`/carbon-calculations/${id}`);
  },

  // 탄소 계산 삭제
  deleteCalculation: (id: string) => {
    return apiClient.delete(`/carbon-calculations/${id}`);
  },

  // 교통수단별 탄소 배출량 계산
  calculateTransportCarbon: (data: {
    transportType: RouteData["transportType"];
    distance: number;
  }) => {
    return apiClient.post<{ carbon: number }>(
      "/carbon-calculations/transport",
      data
    );
  },

  // 숙박시설별 탄소 배출량 계산
  calculateAccommodationCarbon: (data: {
    accommodationType: AccommodationData["type"];
    nights: number;
  }) => {
    return apiClient.post<{ carbon: number }>(
      "/carbon-calculations/accommodation",
      data
    );
  },

  // 사용자 총 탄소 절약량 조회
  getUserCarbonSavings: (userId: string) => {
    return apiClient.get<{ totalSavings: number; calculationsCount: number }>(
      `/users/${userId}/carbon-savings`
    );
  },
};
