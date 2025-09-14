import { calculatorApi } from "@/lib/api/calculator";
import { queryKeys } from "@/lib/query-keys";
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
import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";

// 교통수단 타입 조회
export const useGetTransportationTypes = (
  options?: Omit<
    UseQueryOptions<TransportationType[], ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.carbon.transport(),
    queryFn: () => calculatorApi.getTransportTypes().then((res) => res.data),
    ...options,
  });
};

// 숙박 타입 조회
export const useGetAccommodationTypes = (
  options?: Omit<
    UseQueryOptions<AccommodationType[], ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.carbon.accommodation(),
    queryFn: () =>
      calculatorApi.getAccommodationTypes().then((res) => res.data),
    ...options,
  });
};

// 5.1 계산 세션 시작 Mutation
export const useCreateCarbonSession = (
  options?: UseMutationOptions<CarbonSession, ApiError, CarbonSessionRequest>
) => {
  return useMutation({
    mutationFn: (data: CarbonSessionRequest) =>
      calculatorApi.createCarbonSession(data).then((res) => res.data),
    ...options,
  });
};

// 5.2 경로 및 코스 정보 저장 Mutation
export const useSaveRoutes = (
  options?: UseMutationOptions<
    RoutesResponse,
    ApiError,
    { sessionId: string; data: RoutesRequest }
  >
) => {
  return useMutation({
    mutationFn: ({ sessionId, data }) =>
      calculatorApi.saveRoutes(sessionId, data).then((res) => res.data),
    ...options,
  });
};

// 5.3 숙박 정보 저장 Mutation
export const useSaveAccommodations = (
  options?: UseMutationOptions<
    AccommodationsResponse,
    ApiError,
    { sessionId: string; data: AccommodationsRequest }
  >
) => {
  return useMutation({
    mutationFn: ({ sessionId, data }) =>
      calculatorApi.saveAccommodations(sessionId, data).then((res) => res.data),
    ...options,
  });
};

// 5.5 최종 계산 결과 Mutation
export const useCalculateCarbon = (
  options?: UseMutationOptions<CarbonCalculationResult, ApiError, string>
) => {
  return useMutation({
    mutationFn: (sessionId: string) =>
      calculatorApi.calculateCarbon(sessionId).then((res) => res.data),
    ...options,
  });
};
