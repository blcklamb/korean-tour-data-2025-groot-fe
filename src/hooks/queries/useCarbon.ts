import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import { carbonApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { CarbonCalculation, RouteData, AccommodationData } from "@/types";
import { PaginationParams, PaginatedResponse, ApiError } from "@/types/api";

// 탄소 계산 조회 관련 Query Hooks
export const useUserCarbonCalculations = (
  userId: string,
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<CarbonCalculation>, ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.carbon.userCalculations(userId, params),
    queryFn: () =>
      carbonApi.getUserCalculations(userId, params).then((res) => res.data),
    enabled: !!userId,
    ...options,
  });
};

export const useCarbonCalculation = (
  id: string,
  options?: Omit<
    UseQueryOptions<CarbonCalculation, ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.carbon.calculation(id),
    queryFn: () => carbonApi.getCalculation(id).then((res) => res.data),
    enabled: !!id,
    ...options,
  });
};

export const useUserCarbonSavings = (
  userId: string,
  options?: Omit<
    UseQueryOptions<
      { totalSavings: number; calculationsCount: number },
      ApiError
    >,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.carbon.savings(userId),
    queryFn: () =>
      carbonApi.getUserCarbonSavings(userId).then((res) => res.data),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2분 동안 신선함
    ...options,
  });
};

// 탄소 계산 Mutation Hooks
export const useCreateCarbonCalculation = (
  options?: UseMutationOptions<
    CarbonCalculation,
    ApiError,
    {
      routes: Omit<RouteData, "id" | "carbon">[];
      accommodations: Omit<AccommodationData, "id" | "carbon">[];
    }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      carbonApi.createCalculation(data).then((res) => res.data),
    onSuccess: (data) => {
      // 사용자의 탄소 계산 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.carbon.userCalculations(data.userId),
      });

      // 사용자의 탄소 절약량 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.carbon.savings(data.userId),
      });

      // 새로 생성된 계산을 캐시에 추가
      queryClient.setQueryData(queryKeys.carbon.calculation(data.id), data);
    },
    ...options,
  });
};

export const useDeleteCarbonCalculation = (
  options?: UseMutationOptions<void, ApiError, { id: string; userId: string }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }) => {
      await carbonApi.deleteCalculation(id);
    },
    onSuccess: (_, variables) => {
      // 특정 계산 캐시 제거
      queryClient.removeQueries({
        queryKey: queryKeys.carbon.calculation(variables.id),
      });

      // 사용자의 탄소 계산 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.carbon.userCalculations(variables.userId),
      });

      // 사용자의 탄소 절약량 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.carbon.savings(variables.userId),
      });
    },
    ...options,
  });
};

// 탄소 계산 도우미 Hooks
export const useCalculateTransportCarbon = (
  options?: UseMutationOptions<
    { carbon: number },
    ApiError,
    {
      transportType: RouteData["transportType"];
      distance: number;
    }
  >
) => {
  return useMutation({
    mutationFn: (data) =>
      carbonApi.calculateTransportCarbon(data).then((res) => res.data),
    ...options,
  });
};

export const useCalculateAccommodationCarbon = (
  options?: UseMutationOptions<
    { carbon: number },
    ApiError,
    {
      accommodationType: AccommodationData["type"];
      nights: number;
    }
  >
) => {
  return useMutation({
    mutationFn: (data) =>
      carbonApi.calculateAccommodationCarbon(data).then((res) => res.data),
    ...options,
  });
};

// Optimistic Updates를 위한 Hook
export const useOptimisticCarbonCalculation = () => {
  const queryClient = useQueryClient();

  const addOptimisticCalculation = (
    userId: string,
    tempCalculation: Omit<CarbonCalculation, "id"> & { id: string }
  ) => {
    queryClient.setQueryData(
      queryKeys.carbon.userCalculations(userId),
      (old: PaginatedResponse<CarbonCalculation> | undefined) => {
        if (!old) return old;

        return {
          ...old,
          data: [tempCalculation, ...old.data],
          meta: {
            ...old.meta,
            total: old.meta.total + 1,
          },
        };
      }
    );
  };

  const removeOptimisticCalculation = (userId: string, tempId: string) => {
    queryClient.setQueryData(
      queryKeys.carbon.userCalculations(userId),
      (old: PaginatedResponse<CarbonCalculation> | undefined) => {
        if (!old) return old;

        return {
          ...old,
          data: old.data.filter((calc) => calc.id !== tempId),
          meta: {
            ...old.meta,
            total: old.meta.total - 1,
          },
        };
      }
    );
  };

  return {
    addOptimisticCalculation,
    removeOptimisticCalculation,
  };
};
