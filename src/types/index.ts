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
  name: string;
  email: string;
  avatar?: string;
  level: number;
  points: number;
  badges: Badge[];
  carbonSaved: number;
  joinedAt: string;
}
