import {
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ecoTourApi,
  EcoTourCourseFilters,
  EcoTourCourseLikePayload,
} from "@/lib/api/eco-tour";
import { queryKeys } from "@/lib/query-keys";
import {
  EcoTourCategory,
  EcoTourCourseDetail,
  EcoTourCourseSummary,
  EcoTourSigungu,
} from "@/types";
import { ApiError } from "@/types/api";

export const useEcoTourCourses = (
  filters?: EcoTourCourseFilters,
  options?: Omit<
    UseQueryOptions<{ courses: EcoTourCourseSummary[] }, ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.ecoTours.list(filters),
    queryFn: async () => {
      const response = await ecoTourApi.getCourses(filters);
      return response.data;
    },
    ...options,
  });
};

export const useEcoTourCourse = (
  courseId: number | string,
  options?: Omit<UseQueryOptions<EcoTourCourseDetail, ApiError>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: queryKeys.ecoTours.detail(String(courseId)),
    queryFn: async () => {
      const response = await ecoTourApi.getCourse(courseId);
      return response.data;
    },
    enabled: !!courseId,
    ...options,
  });
};

export const useEcoTourCategories = (
  options?: Omit<
    UseQueryOptions<EcoTourCategory[], ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.ecoTours.categories(),
    queryFn: async () => {
      const response = await ecoTourApi.getCategories();
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useEcoTourSigungus = (
  options?: Omit<
    UseQueryOptions<EcoTourSigungu[], ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.ecoTours.sigungu(),
    queryFn: async () => {
      const response = await ecoTourApi.getSigungus();
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useToggleEcoTourCourseLike = (
  options?: UseMutationOptions<
    EcoTourCourseLikePayload,
    ApiError,
    { courseId: number }
  >
) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, onSettled, ...restOptions } = options ?? {};

  return useMutation({
    mutationFn: ({ courseId }) => ecoTourApi.toggleCourseLike(courseId),
    mutationKey: ["eco-tour", "like"],
    ...restOptions,
    onSuccess: (data, variables, context) => {
      const courseIdKey = String(variables.courseId);

      queryClient.setQueryData<EcoTourCourseDetail | undefined>(
        queryKeys.ecoTours.detail(courseIdKey),
        (current) =>
          current
            ? {
                ...current,
                likeCount: data.likeCount,
                isLiked: data.isLiked,
              }
            : current
      );

      queryClient.invalidateQueries({ queryKey: queryKeys.ecoTours.lists() });

      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      onError?.(error, variables, context);
    },
    onSettled: (data, error, variables, context) => {
      onSettled?.(data, error, variables, context);
    },
  });
};
