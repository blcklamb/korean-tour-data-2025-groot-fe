// 시도 목록 조회
export interface LocationArea {
  id: number;
  areaCode: number;
  areaName: string;
}

export interface EcoTourCategory {
  id: number;
  categoryName: string;
}

export interface EcoTourSigungu {
  id: number;
  sigunguCode: number;
  areaName: string;
  sigunguName: string;
  mapX: number;
  mapY: number;
}

// 미션 시스템 관련 타입
export interface MissionListItem {
  id: number;
  name: string;
  description: string;
  icon: string;
  tag: string;
  rewardCarbonEmission: number;
}

export interface MissionHistoryUser {
  userId: string;
  nickname: string;
  address?: string;
}

export interface MissionBadgeReward {
  id: number;
  name: string;
  iconUrl?: string;
  imageUrl?: string;
}

export interface MissionHistoryMissionInfo {
  name: string;
  icon: string;
  tag?: string;
  thumbnailUrl?: string;
}

export interface MissionHistorySummary {
  id: number;
  mission: MissionHistoryMissionInfo;
  content: string;
  thumbnailUrl?: string;
  rewardCarbonEmission: number;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface MissionFeedItem {
  id: number;
  user: MissionHistoryUser;
  mission: MissionHistoryMissionInfo & { tag: string };
  rewardBadge?: MissionBadgeReward | null;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface MissionHistoryDetail {
  history: {
    id: number;
    user: MissionHistoryUser;
    mission: MissionHistoryMissionInfo & { tag: string };
    rewardBadge?: MissionBadgeReward[];
    sigungu?: {
      id: number;
      sigunguCode: number;
      sigunguName: string;
      mapX: number;
      mapY: number;
      areaId: number;
    };
    content: string;
    imageUrls: string[];
    likeCount: number;
    isLiked: boolean;
    createdAt: string;
  };
  sameMissions: MissionFeedItem[];
  nearByMissions: MissionFeedItem[];
}

export interface MissionCompletionResult {
  missionHistoryId: number;
  rewardCarbonEmission: number;
  rewardBadge?: MissionBadgeReward | null;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
  expiresIn: number;
}

export interface CourseVisitStamp {
  stampId: number;
  courseTitle: string;
  stampImageUrl: string;
  currentCount: number;
  visitedAt: string;
}

export interface StampCollectionEntry {
  id: number;
  course: {
    id: number;
    title: string;
    areaName: string;
    sigunguName: string;
  };
  stampImageUrl: string;
  isLimited: boolean;
  visitedAt: string;
}

export interface StampCollectionStatistics {
  totalStamps: number;
  areaCompletionRate: number;
  completedAreas: string[];
}

export interface StampCollectionSummary {
  stamps: StampCollectionEntry[];
  statistics: StampCollectionStatistics;
}

// 생태 관광 코스 목록 조회
export interface EcoTourSpotSummary {
  id: number;
  title: string;
  thumbnailUrl: string;
  tags: string[];
  carbonEmissionPerPerson: number;
}

export interface EcoTourCourseSummary {
  id: number;
  title: string;
  thumbnailUrl: string;
  areaName: string;
  sigunguName: string;
  spots: EcoTourSpotSummary[];
  totalCarbonEmission: number;
  viewCount: number;
  likeCount: number;
  isLiked: boolean;
}

export interface EcoTourSpotDetail extends EcoTourSpotSummary {
  summary: string;
  address1: string;
  mapX: number;
  mapY: number;
  imageUrl1?: string;
  tel?: string;
}

export interface EcoTourCourseDetail {
  id: number;
  title: string;
  thumbnailUrl: string;
  areaName: string;
  sigunguName: string;
  spots: EcoTourSpotDetail[];
  totalCarbonEmission: number;
  viewCount: number;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
}

// 교통 수단 타입
export interface TransportationType {
  id: number;
  name: string;
  type: string;
  carbonEmissionPerKm: number;
  icon: string;
}

// 숙박 타입
export interface AccommodationType {
  id: number;
  name: string;
  type: string;
  carbonEmissionPerNight: number;
}

// 탄소 계산 세션 관련 타입
export interface CarbonSession {
  sessionId: string;
  step: number;
  participantCount: number;
  expiresAt: string;
}

export interface CarbonSessionRequest {
  participantCount: number;
}

export interface RouteInfo {
  departureLocationId?: number;
  arrivalLocationId?: number;
  courseId?: number;
  transportationTypeId: number;
  orderIndex: number;
}

export interface RoutesRequest {
  routes: RouteInfo[];
}

export interface RoutesResponse {
  sessionId: string;
  step: number;
  transportationEmission: number;
}

export interface AccommodationInfo {
  startDate: string;
  endDate: string;
  accommodationTypeId: number;
  orderIndex: number;
}

export interface AccommodationsRequest {
  accommodations: AccommodationInfo[];
}

export interface AccommodationsResponse {
  sessionId: string;
  step: number;
  accommodationEmission: number;
}

export interface CarbonCalculationResult {
  resultId: number;
  totalCarbonEmission: number;
  result: {
    transportation: number;
    accommodation: number;
    course: number;
  };
  participantCount: number;
}

// 위치/관광지 관련 타입
export interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: string;
  description?: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
}

// 카테고리 타입
export interface Category {
  id: string;
  name: string;
  code: string;
  description?: string;
  icon?: string;
}

// 에코 투어 코스 타입
export interface EcoTourCourse {
  id: string;
  title: string;
  description: string;
  duration: number; // 소요 시간 (분)
  difficulty: "easy" | "medium" | "hard";
  locations: Location[];
  carbonReduction: number; // 탄소 절약량
  images: string[];
  rating: number;
  reviewCount: number;
}

// 탄소 계산 관련 타입
export interface CarbonCalculation {
  id: string;
  userId: string;
  routes: RouteData[];
  totalCarbon: number;
  accommodations: AccommodationData[];
  createdAt: string;
}

export interface RouteData {
  id: string;
  from: Location;
  to: Location;
  transportType: "car" | "bus" | "train" | "subway" | "walk" | "bike";
  distance: number;
  carbon: number;
}

export interface AccommodationData {
  id: string;
  name: string;
  type: "hotel" | "pension" | "camping" | "guesthouse";
  nights: number;
  carbon: number;
}

// 미션 타입
export interface Mission {
  id: string;
  title: string;
  description: string;
  type: "carbon" | "visit" | "review" | "share";
  target: number;
  reward: number; // 포인트
  completed: boolean;
  progress: number;
  deadline?: string;
}

// 배지 타입
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: "carbon" | "travel" | "social" | "special";
}

// 사용자 타입
export interface User {
  id: string;
  email: string;
  nickname: string;
  birthYear?: number;
  gender?: "male" | "female";
  address?: string;
  profileImageUrl?: string;
  role: "USER" | "ADMIN";
  authProvider: "kakao" | "demo";
  level?: number;
  points?: number;
  badges?: Badge[];
  carbonSaved?: number;
  createdAt: string;
}

// 인증 관련 타입들
export interface KakaoLoginRequest {
  accessToken: string;
}

export interface DemoLoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface UpdateProfileRequest {
  nickname: string;
  birthYear: number;
  gender: "male" | "female";
  address: string;
  profileImageUrl?: string;
  primaryBadgeId?: number;
}

export interface LogoutResponse {
  message: string;
}
