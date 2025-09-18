import { apiClient } from "./client";
import {
  EcoTourCategory,
  EcoTourCourseDetail,
  EcoTourCourseSummary,
  EcoTourSigungu,
} from "@/types";

export interface EcoTourCourseFilters {
  areaId?: number;
  sigunguId?: number;
  categoryId?: number;
  tags?: string[];
}

interface EcoTourCoursesResponse {
  courses: EcoTourCourseSummary[];
}

export interface EcoTourCourseLikePayload {
  isLiked: boolean;
  likeCount: number;
}

export const ecoTourApi = {
  getCourses: (filters?: EcoTourCourseFilters) => {
    const searchParams = new URLSearchParams();

    if (filters?.areaId) {
      searchParams.set("areaId", filters.areaId.toString());
    }
    if (filters?.sigunguId) {
      searchParams.set("sigunguId", filters.sigunguId.toString());
    }
    if (filters?.categoryId) {
      searchParams.set("categoryId", filters.categoryId.toString());
    }
    if (filters?.tags && filters.tags.length > 0) {
      searchParams.set("tags", filters.tags.join(","));
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/courses?${queryString}` : `/courses`;

    return apiClient.get<EcoTourCoursesResponse>(endpoint);
  },

  getCourse: (courseId: number | string) => {
    return apiClient.get<EcoTourCourseDetail>(`/courses/${courseId}`);
  },

  toggleCourseLike: async (
    courseId: number
  ): Promise<EcoTourCourseLikePayload> => {
    const response = await apiClient.post<EcoTourCourseLikePayload>(
      `/courses/${courseId}/like`
    );
    return response.data;
  },

  getCategories: () => apiClient.get<EcoTourCategory[]>("/courses/categories"),

  getSigungus: () => {
    return apiClient.get<EcoTourSigungu[]>("/courses/locations/sigungus");
  },
};

export default ecoTourApi;
