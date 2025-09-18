// Query Keys를 상수로 관리하여 일관성과 타입 안정성 확보
export const queryKeys = {
  // 위치/관광지 관련 키
  locations: {
    all: ["locations"] as const,
    lists: () => [...queryKeys.locations.all, "list"] as const,
    list: (params?: unknown) =>
      [...queryKeys.locations.lists(), params] as const,
    details: () => [...queryKeys.locations.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.locations.details(), id] as const,
    nearby: (lat: number, lng: number, radius?: number) =>
      [...queryKeys.locations.all, "nearby", lat, lng, radius] as const,
    search: (query: string, params?: unknown) =>
      [...queryKeys.locations.all, "search", query, params] as const,
    popular: (limit?: number) =>
      [...queryKeys.locations.all, "popular", limit] as const,
    byCategory: (categoryId: string, params?: unknown) =>
      [...queryKeys.locations.all, "category", categoryId, params] as const,
  },

  // 카테고리 관련 키
  categories: {
    all: ["categories"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
    details: () => [...queryKeys.categories.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
  },

  // 탄소 계산 관련 키
  carbon: {
    all: ["carbon"] as const,
    calculations: () => [...queryKeys.carbon.all, "calculations"] as const,
    userCalculations: (userId: string, params?: unknown) =>
      [...queryKeys.carbon.calculations(), "user", userId, params] as const,
    calculation: (id: string) =>
      [...queryKeys.carbon.calculations(), id] as const,
    transport: () => [...queryKeys.carbon.all, "transport"] as const,
    accommodation: () => [...queryKeys.carbon.all, "accommodation"] as const,
    savings: (userId: string) =>
      [...queryKeys.carbon.all, "savings", userId] as const,
    sessions: () => [...queryKeys.carbon.all, "sessions"] as const,
    session: (sessionId: string) =>
      [...queryKeys.carbon.sessions(), sessionId] as const,
  },

  // 에코 투어 코스 관련 키
  ecoTours: {
    all: ["eco-tours"] as const,
    lists: () => [...queryKeys.ecoTours.all, "list"] as const,
    list: (params?: unknown) =>
      [...queryKeys.ecoTours.lists(), params] as const,
    details: () => [...queryKeys.ecoTours.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.ecoTours.details(), id] as const,
    categories: () => [...queryKeys.ecoTours.all, "categories"] as const,
    sigungu: () => [...queryKeys.ecoTours.all, "sigungus"] as const,
    recommended: (userId?: string, limit?: number) =>
      [...queryKeys.ecoTours.all, "recommended", userId, limit] as const,
    popular: (limit?: number) =>
      [...queryKeys.ecoTours.all, "popular", limit] as const,
    byDifficulty: (difficulty: string, params?: unknown) =>
      [...queryKeys.ecoTours.all, "difficulty", difficulty, params] as const,
    search: (query: string, params?: unknown) =>
      [...queryKeys.ecoTours.all, "search", query, params] as const,
  },

  // 미션 관련 키
  missions: {
    all: ["missions"] as const,
    lists: () => [...queryKeys.missions.all, "list"] as const,
    list: (params?: unknown) =>
      [...queryKeys.missions.lists(), params] as const,
    details: () => [...queryKeys.missions.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.missions.details(), String(id)] as const,
    user: (userId: string, params?: unknown) =>
      [...queryKeys.missions.all, "user", userId, params] as const,
    feed: () => [...queryKeys.missions.all, "feed"] as const,
    histories: () => [...queryKeys.missions.all, "histories"] as const,
    historyDetail: (historyId: number) =>
      [...queryKeys.missions.all, "history", historyId] as const,
    tag: (tag?: string) => [...queryKeys.missions.all, "tag", tag] as const,
  },

  stamps: {
    all: ["stamps"] as const,
    collection: (areaId?: number) =>
      [...queryKeys.stamps.all, "collection", areaId] as const,
  },

  // 배지 관련 키
  badges: {
    all: ["badges"] as const,
    lists: () => [...queryKeys.badges.all, "list"] as const,
    list: (category?: string) =>
      [...queryKeys.badges.lists(), category] as const,
    details: () => [...queryKeys.badges.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.badges.details(), id] as const,
    user: (userId: string) =>
      [...queryKeys.badges.all, "user", userId] as const,
  },

  // 사용자 관련 키
  users: {
    all: ["users"] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    stats: (id: string) => [...queryKeys.users.all, "stats", id] as const,
    shareHistory: (id: string, params?: unknown) =>
      [...queryKeys.users.all, "share-history", id, params] as const,
  },

  // 인증 관련 키
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
    profile: () => [...queryKeys.auth.all, "profile"] as const,
  },
} as const;

// Query Key 팩토리 함수들
export const createQueryKey = {
  // 동적으로 query key 생성
  withParams: (baseKey: readonly unknown[], params: unknown) => {
    return [...baseKey, params] as const;
  },

  // 페이지네이션이 포함된 query key 생성
  withPagination: (
    baseKey: readonly unknown[],
    page?: number,
    limit?: number
  ) => {
    return [...baseKey, { page, limit }] as const;
  },
};
