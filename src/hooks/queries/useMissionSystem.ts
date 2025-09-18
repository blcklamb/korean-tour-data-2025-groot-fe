import {
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CourseVisitPayload,
  courseVisitApi,
  missionsApi,
  stampCollectionApi,
} from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import {
  CourseVisitStamp,
  MissionCompletionResult,
  MissionFeedItem,
  MissionHistoryDetail,
  MissionHistorySummary,
  MissionListItem,
  PresignedUrlResponse,
  StampCollectionSummary,
} from "@/types";
import { ApiError } from "@/types/api";

const MOCK_MISSIONS: MissionListItem[] = [
  {
    id: 1,
    name: "텀블러 사용하기",
    description: "일회용 컵 대신 개인 텀블러를 사용해보세요",
    icon: "☕️",
    tag: "일상",
    rewardCarbonEmission: 1.8,
  },
  {
    id: 2,
    name: "대중교통 이용하기",
    description: "출퇴근길 한 번쯤 대중교통을 이용해보세요",
    icon: "🚆",
    tag: "출근",
    rewardCarbonEmission: 2.4,
  },
];

const MOCK_HISTORIES: MissionHistorySummary[] = [
  {
    id: 101,
    mission: {
      name: "텀블러 사용하기",
      icon: "☕️",
    },
    content: "텀블러를 사용해서 커피를 마셨습니다!",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80",
    rewardCarbonEmission: 1.8,
    likeCount: 15,
    isLiked: false,
    createdAt: "2024-01-01T00:00:00.000Z",
  },
];

const MOCK_FEED: MissionFeedItem[] = [
  {
    id: 201,
    user: {
      userId: "mock-user",
      nickname: "친환경러",
    },
    mission: {
      name: "텀블러 사용하기",
      icon: "☕️",
      tag: "일상",
    },
    rewardBadge: {
      id: 5,
      name: "친환경 실천가",
      imageUrl:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
    },
    likeCount: 23,
    isLiked: false,
    createdAt: "2024-01-02T12:00:00.000Z",
  },
];

const MOCK_HISTORY_DETAIL: MissionHistoryDetail = {
  history: {
    id: 101,
    user: {
      userId: "mock-user",
      nickname: "친환경러",
      address: "서울특별시 강남구",
    },
    mission: {
      name: "텀블러 사용하기",
      icon: "☕️",
      tag: "일상",
    },
    rewardBadge: [
      {
        id: 5,
        name: "친환경 실천가",
        iconUrl:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=200&q=80",
      },
    ],
    sigungu: {
      id: 1,
      sigunguCode: 11010,
      sigunguName: "강남구",
      mapX: 127.0495556,
      mapY: 37.514575,
      areaId: 1,
    },
    content: "텀블러 사용으로 일회용 컵을 줄였어요!",
    imageUrls: [
      "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=80",
    ],
    likeCount: 15,
    isLiked: false,
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  sameMissions: MOCK_FEED,
  nearByMissions: MOCK_FEED,
};

const MOCK_STAMPS: StampCollectionSummary = {
  stamps: [
    {
      id: 456,
      course: {
        id: 1,
        title: "문경새재 벚꽃길",
        areaName: "경상북도",
        sigunguName: "문경시",
      },
      stampImageUrl:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
      isLimited: true,
      visitedAt: "2024-01-01T10:00:00.000Z",
    },
  ],
  statistics: {
    totalStamps: 15,
    areaCompletionRate: 60,
    completedAreas: ["서울특별시"],
  },
};

const MOCK_VISIT_STAMP: CourseVisitStamp = {
  stampId: 456,
  courseTitle: "문경새재 벚꽃길",
  stampImageUrl:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
  currentCount: 45,
  visitedAt: new Date().toISOString(),
};

const MOCK_PRESIGNED: PresignedUrlResponse = {
  uploadUrl: "https://s3.mock/upload",
  fileUrl: "https://s3.mock/mission.jpg",
  expiresIn: 900,
};

export const useMissionList = (
  tag?: string,
  options?: Omit<
    UseQueryOptions<MissionListItem[], ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.missions.tag(tag),
    queryFn: async () => {
      try {
        const response = await missionsApi.getMissions(tag);
        return response.data.missions;
      } catch (error) {
        console.error("Failed to fetch missions", error);
        return tag
          ? MOCK_MISSIONS.filter((mission) => mission.tag === tag)
          : MOCK_MISSIONS;
      }
    },
    ...options,
  });
};

export const useMissionHistories = (
  options?: Omit<
    UseQueryOptions<MissionHistorySummary[], ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.missions.histories(),
    queryFn: async () => {
      try {
        const response = await missionsApi.getMissionHistories();
        return response.data.histories;
      } catch (error) {
        console.error("Failed to fetch mission histories", error);
        return MOCK_HISTORIES;
      }
    },
    ...options,
  });
};

export const useMissionFeed = (
  options?: Omit<
    UseQueryOptions<MissionFeedItem[], ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.missions.feed(),
    queryFn: async () => {
      try {
        const response = await missionsApi.getMissionFeed();
        return response.data.histories;
      } catch (error) {
        console.error("Failed to fetch mission feed", error);
        return MOCK_FEED;
      }
    },
    ...options,
  });
};

export const useMissionHistoryDetail = (
  historyId: number | null,
  options?: Omit<
    UseQueryOptions<MissionHistoryDetail, ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.missions.historyDetail(historyId ?? 0),
    enabled: !!historyId,
    queryFn: async () => {
      if (!historyId) {
        return MOCK_HISTORY_DETAIL;
      }

      try {
        const response = await missionsApi.getMissionHistoryDetail(historyId);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch mission history detail", error);
        return MOCK_HISTORY_DETAIL;
      }
    },
    ...options,
  });
};

export const useMissionCompletion = (
  options?: UseMutationOptions<
    MissionCompletionResult,
    ApiError,
    { missionId: number; formData: FormData }
  >
) => {
  const { onSuccess, onError, onSettled, ...restOptions } = options ?? {};

  return useMutation({
    mutationFn: async ({ missionId, formData }) => {
      try {
        const response = await missionsApi.completeMission(missionId, formData);
        return response.data;
      } catch (error) {
        console.error("Failed to complete mission", error);
        return {
          missionHistoryId: Date.now(),
          rewardCarbonEmission: 1.5,
          rewardBadge: MOCK_FEED[0]?.rewardBadge ?? null,
        } satisfies MissionCompletionResult;
      }
    },
    ...restOptions,
    onSuccess,
    onError,
    onSettled,
  });
};

export const useMissionHistoryLike = (
  options?: UseMutationOptions<
    { isLiked: boolean; likeCount: number },
    ApiError,
    { historyId: number }
  >
) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, onSettled, ...restOptions } = options ?? {};

  return useMutation({
    mutationFn: async ({ historyId }) => {
      try {
        const response = await missionsApi.likeMissionHistory(historyId);
        return response.data;
      } catch (error) {
        console.error("Failed to toggle like", error);
        return {
          isLiked: true,
          likeCount: 1,
        };
      }
    },
    ...restOptions,
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData<MissionHistorySummary[] | undefined>(
        queryKeys.missions.histories(),
        (current) =>
          current?.map((history) =>
            history.id === variables.historyId
              ? { ...history, isLiked: data.isLiked, likeCount: data.likeCount }
              : history
          ) ?? current
      );

      queryClient.setQueryData<MissionHistoryDetail | undefined>(
        queryKeys.missions.historyDetail(variables.historyId),
        (current) =>
          current
            ? {
                ...current,
                history: {
                  ...current.history,
                  isLiked: data.isLiked,
                  likeCount: data.likeCount,
                },
              }
            : current
      );

      queryClient.setQueryData<MissionFeedItem[] | undefined>(
        queryKeys.missions.feed(),
        (feed) =>
          feed?.map((item) =>
            item.id === variables.historyId
              ? { ...item, isLiked: data.isLiked, likeCount: data.likeCount }
              : item
          ) ?? feed
      );

      onSuccess?.(data, variables, context);
    },
    onError,
    onSettled,
  });
};

export const useMissionPresignedUrl = (
  options?: UseMutationOptions<
    PresignedUrlResponse,
    ApiError,
    { fileName: string; fileType: string }
  >
) => {
  const { onSuccess, onError, onSettled, ...restOptions } = options ?? {};

  return useMutation({
    mutationFn: async ({ fileName, fileType }) => {
      try {
        const response = await missionsApi.getUploadPresignedUrl({
          fileName,
          fileType,
        });
        return response.data;
      } catch (error) {
        console.error("Failed to get presigned url", error);
        return MOCK_PRESIGNED;
      }
    },
    ...restOptions,
    onSuccess,
    onError,
    onSettled,
  });
};

export const useCourseVisit = (
  options?: UseMutationOptions<
    CourseVisitStamp,
    ApiError,
    { courseId: number; payload: CourseVisitPayload }
  >
) => {
  const { onSuccess, onError, onSettled, ...restOptions } = options ?? {};

  return useMutation({
    mutationFn: async ({ courseId, payload }) => {
      try {
        const response = await courseVisitApi.visitCourse(courseId, payload);
        return response.data;
      } catch (error) {
        console.error("Failed to record course visit", error);
        return MOCK_VISIT_STAMP;
      }
    },
    ...restOptions,
    onSuccess,
    onError,
    onSettled,
  });
};

export const useStampCollection = (
  areaId?: number,
  options?: Omit<
    UseQueryOptions<StampCollectionSummary, ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.stamps.collection(areaId),
    queryFn: async () => {
      try {
        const response = await stampCollectionApi.getStamps(areaId);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch stamp collection", error);
        return MOCK_STAMPS;
      }
    },
    ...options,
  });
};
