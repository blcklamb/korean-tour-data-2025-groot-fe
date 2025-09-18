import { apiClient } from "./client";
import {
  MissionCompletionResult,
  MissionFeedItem,
  MissionHistoryDetail,
  MissionHistorySummary,
  MissionListItem,
  PresignedUrlResponse,
  StampCollectionSummary,
  CourseVisitStamp,
} from "@/types";

export interface MissionListResponse {
  missions: MissionListItem[];
}

export interface MissionHistoriesResponse {
  histories: MissionHistorySummary[];
}

export interface MissionFeedResponse {
  histories: MissionFeedItem[];
}

export const missionsApi = {
  getMissions: (tag?: string) => {
    const searchParams = new URLSearchParams();
    if (tag) {
      searchParams.set("tag", tag);
    }

    const query = searchParams.toString();
    const endpoint = query ? `/missions?${query}` : "/missions";
    return apiClient.get<MissionListResponse>(endpoint);
  },

  completeMission: (missionId: number, formData: FormData) => {
    return apiClient.post<MissionCompletionResult>(
      `/missions/${missionId}/complete`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  getMissionHistories: () => {
    return apiClient.get<MissionHistoriesResponse>("/missions/history");
  },

  likeMissionHistory: (historyId: number) => {
    return apiClient.post<{ isLiked: boolean; likeCount: number }>(
      `/missions/history/${historyId}/like`
    );
  },

  getMissionFeed: () => {
    return apiClient.get<MissionFeedResponse>("/missions/feed");
  },

  getMissionHistoryDetail: (historyId: number) => {
    return apiClient.get<MissionHistoryDetail>(
      `/missions/history/${historyId}`
    );
  },

  getUploadPresignedUrl: (params: { fileName: string; fileType: string }) => {
    return apiClient.post<PresignedUrlResponse>(
      "/missions/upload/presigned-url",
      params
    );
  },
};

export interface CourseVisitPayload {
  latitude: number;
  longitude: number;
  visitDate: string;
}

export const courseVisitApi = {
  visitCourse: (courseId: number, payload: CourseVisitPayload) => {
    return apiClient.post<CourseVisitStampResponse>(
      `/courses/${courseId}/visit`,
      payload
    );
  },
};

export type CourseVisitStampResponse = CourseVisitStamp;

export const stampCollectionApi = {
  getStamps: (areaId?: number) => {
    const searchParams = new URLSearchParams();
    if (typeof areaId === "number") {
      searchParams.set("areaId", String(areaId));
    }

    const query = searchParams.toString();
    const endpoint = query ? `/users/stamps?${query}` : "/users/stamps";
    return apiClient.get<StampCollectionSummary>(endpoint);
  },
};
