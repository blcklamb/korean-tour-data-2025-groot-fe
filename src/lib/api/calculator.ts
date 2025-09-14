import apiClient from "./client";
import {
  AccommodationType,
  TransportationType,
  CarbonSession,
  CarbonSessionRequest,
  RoutesRequest,
  RoutesResponse,
  AccommodationsRequest,
  AccommodationsResponse,
  CarbonCalculationResult,
} from "@/types";

export const calculatorApi = {
  // 교통수단 타입 조회
  getTransportTypes: () => {
    return apiClient.get<TransportationType[]>(`/carbon/transportation-types`);
  },

  // 숙박 타입 조회
  getAccommodationTypes: () => {
    return apiClient.get<AccommodationType[]>(`/carbon/accommodation-types`);
  },

  // 5.1 계산 세션 시작 - 여행 인원
  createCarbonSession: (data: CarbonSessionRequest) => {
    return apiClient.post<CarbonSession>(`/carbon/sessions`, data);
  },

  // 5.2 경로 및 코스 정보 저장
  saveRoutes: (sessionId: string, data: RoutesRequest) => {
    return apiClient.post<RoutesResponse>(
      `/carbon/sessions/${sessionId}/routes`,
      data
    );
  },

  // 5.3 숙박 정보 저장
  saveAccommodations: (sessionId: string, data: AccommodationsRequest) => {
    return apiClient.post<AccommodationsResponse>(
      `/carbon/sessions/${sessionId}/accommodation`,
      data
    );
  },

  // 5.5 최종 계산 결과
  calculateCarbon: (sessionId: string) => {
    return apiClient.post<CarbonCalculationResult>(
      `/carbon/sessions/${sessionId}/calculate`
    );
  },
};
