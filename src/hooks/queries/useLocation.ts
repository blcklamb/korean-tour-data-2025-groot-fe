import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { locationApi, categoryApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { Location, Category } from "@/types";
import { PaginationParams, PaginatedResponse, ApiError } from "@/types/api";

// 위치 관련 Query Hooks
export const useLocations = (
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Location>, ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.locations.list(),
    queryFn: () => locationApi.getLocations().then((res) => res.data),
    ...options,
  });
};

export const useLocation = (
  id: string,
  options?: Omit<UseQueryOptions<Location, ApiError>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: queryKeys.locations.detail(id),
    queryFn: () => locationApi.getLocation(id).then((res) => res.data),
    enabled: !!id,
    ...options,
  });
};

export const useLocationsByCategory = (
  categoryId: string,
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Location>, ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.locations.byCategory(categoryId, params),
    queryFn: () =>
      locationApi
        .getLocationsByCategory(categoryId, params)
        .then((res) => res.data),
    enabled: !!categoryId,
    ...options,
  });
};

export const useNearbyLocations = (
  lat: number,
  lng: number,
  radius?: number,
  options?: Omit<UseQueryOptions<Location[], ApiError>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: queryKeys.locations.nearby(lat, lng, radius),
    queryFn: () =>
      locationApi.getNearbyLocations(lat, lng, radius).then((res) => res.data),
    enabled: !!(lat && lng),
    ...options,
  });
};

export const useSearchLocations = (
  query: string,
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Location>, ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.locations.search(query, params),
    queryFn: () =>
      locationApi.searchLocations(query, params).then((res) => res.data),
    enabled: !!query && query.length > 0,
    staleTime: 30 * 1000, // 검색 결과는 30초 동안 신선함
    ...options,
  });
};

export const usePopularLocations = (
  limit?: number,
  options?: Omit<UseQueryOptions<Location[], ApiError>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: queryKeys.locations.popular(limit),
    queryFn: () =>
      locationApi.getPopularLocations(limit).then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 인기 장소는 5분 동안 신선함
    ...options,
  });
};

// 카테고리 관련 Query Hooks
export const useCategories = (
  options?: Omit<UseQueryOptions<Category[], ApiError>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: queryKeys.categories.lists(),
    queryFn: () => categoryApi.getCategories().then((res) => res.data),
    staleTime: 10 * 60 * 1000, // 카테고리는 10분 동안 신선함
    ...options,
  });
};

export const useCategory = (
  id: string,
  options?: Omit<UseQueryOptions<Category, ApiError>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => categoryApi.getCategory(id).then((res) => res.data),
    enabled: !!id,
    ...options,
  });
};

// Prefetch Hooks (성능 최적화를 위한 사전 로딩)
export const usePrefetchLocation = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.locations.detail(id),
      queryFn: () => locationApi.getLocation(id).then((res) => res.data),
      staleTime: 60 * 1000,
    });
  };
};

export const usePrefetchLocations = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.locations.list(),
      queryFn: () => locationApi.getLocations().then((res) => res.data),
      staleTime: 60 * 1000,
    });
  };
};
