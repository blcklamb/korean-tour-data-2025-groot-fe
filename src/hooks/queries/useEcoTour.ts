import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ecoTourApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { EcoTourCourse, EcoTourCourseSummary } from "@/types";
import { PaginationParams, PaginatedResponse, ApiError } from "@/types/api";

// 에코 투어 코스 조회 관련 Query Hooks
export const useEcoTourCourses = (
  params?: Parameters<(typeof ecoTourApi)["getCourses"]>,
  options?: Omit<
    UseQueryOptions<EcoTourCourseSummary[], ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.ecoTours.list(params),
    queryFn: () => {
      const [areaId, sigunguId, categoryId, tags] = params ?? [];
      return ecoTourApi
        .getCourses(areaId, sigunguId, categoryId, tags)
        .then((res) => res.data);
    },
    ...options,
  });
};

export const useEcoTourCourse = (
  id: string,
  options?: Omit<
    UseQueryOptions<EcoTourCourse, ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.ecoTours.detail(id),
    queryFn: () => ecoTourApi.getCourse(id).then((res) => res.data),
    enabled: !!id,
    ...options,
  });
};

export const useRecommendedEcoTours = (
  userId?: string,
  limit?: number,
  options?: Omit<
    UseQueryOptions<EcoTourCourse[], ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.ecoTours.recommended(userId, limit),
    queryFn: () =>
      ecoTourApi.getRecommendedCourses(userId, limit).then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 추천 코스는 5분 동안 신선함
    ...options,
  });
};

export const usePopularEcoTours = (
  limit?: number,
  options?: Omit<
    UseQueryOptions<EcoTourCourse[], ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.ecoTours.popular(limit),
    queryFn: () => ecoTourApi.getPopularCourses(limit).then((res) => res.data),
    staleTime: 10 * 60 * 1000, // 인기 코스는 10분 동안 신선함
    ...options,
  });
};

export const useEcoToursByDifficulty = (
  difficulty: EcoTourCourse["difficulty"],
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<EcoTourCourse>, ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.ecoTours.byDifficulty(difficulty, params),
    queryFn: () =>
      ecoTourApi
        .getCoursesByDifficulty(difficulty, params)
        .then((res) => res.data),
    enabled: !!difficulty,
    ...options,
  });
};

export const useSearchEcoTours = (
  query: string,
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<EcoTourCourse>, ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.ecoTours.search(query, params),
    queryFn: () =>
      ecoTourApi.searchCourses(query, params).then((res) => res.data),
    enabled: !!query && query.length > 0,
    staleTime: 30 * 1000, // 검색 결과는 30초 동안 신선함
    ...options,
  });
};

// 에코 투어 코스의 위치 정보만 추출하는 hook
export const useEcoTourLocations = (courseId: string) => {
  const { data: course } = useEcoTourCourse(courseId);

  return {
    locations: course?.locations || [],
    isLoading: !course,
  };
};

// 사용자 맞춤 에코 투어 추천 (사용자 레벨, 선호도 기반)
export const usePersonalizedEcoTours = (
  userId: string,
  userLevel?: number,
  preferences?: {
    preferredDifficulty?: EcoTourCourse["difficulty"];
    maxDuration?: number;
  },
  options?: Omit<
    UseQueryOptions<EcoTourCourse[], ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: ["eco-tours", "personalized", userId, userLevel, preferences],
    queryFn: () =>
      ecoTourApi.getRecommendedCourses(userId, 10).then((res) => res.data),
    enabled: !!userId,
    select: (data) => {
      // 클라이언트 사이드에서 추가 필터링
      return data.filter((course) => {
        if (
          preferences?.preferredDifficulty &&
          course.difficulty !== preferences.preferredDifficulty
        ) {
          return false;
        }
        if (
          preferences?.maxDuration &&
          course.duration > preferences.maxDuration
        ) {
          return false;
        }
        return true;
      });
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
