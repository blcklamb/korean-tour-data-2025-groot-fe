import { ComboboxItem } from "@mantine/core";

export type CarbonCalculationStep =
  | "PERSONNEL"
  | "ROUTE+ECO_COURSES"
  | "ACCOMODATION";

export interface CarbonCalculatorFormValues {
  personnel: number;
  // todo: naming
  routes: {
    departureLocationId?: number;
    arrivalLocationId?: number;
    courseId?: number; // 생태 관광 코스 ID
    transportationTypeId: number;
  }[];
  accomodation: {
    accomodationTypeId: string;
    checkInDate: string;
    checkOutDate: string;
  }[];
}

export interface TransportOption {
  id: number;
  label: string;
  icon?: string;
  value?: string;
}

export interface CourseOption {
  id: number;
  title: string;
  thumbnailUrl: string;
  areaName: string;
  sigunguName: string;
  label: string;
  value: string;
}

export interface TransportSelectProps {
  options: TransportOption[];
  selected: ComboboxItem | null;
  onSelect: (item: TransportOption) => void;
  getIcon?: (item: TransportOption) => React.ReactNode;
  getLabel?: (item: TransportOption) => React.ReactNode;
}

export interface CourseSelectProps {
  options: CourseOption[];
  selected: ComboboxItem | null;
  onSelect: (item: CourseOption) => void;
  getIcon?: (item: CourseOption) => React.ReactNode;
  getLabel?: (item: CourseOption) => React.ReactNode;
}

export interface RouteItemProps {
  departureCityName?: string;
  arrivalCityName?: string;
  courseName?: string;
  transportIcon: string;
  onDelete: () => void;
}

// 지역 옵션 리스트 (도시만, unique id, 경상북도 시 추가)
export const mockLocationOptions: ComboboxItem[] = [
  { value: "1", label: "서울특별시 강남구" },
  { value: "2", label: "경기도 수원시" },
  { value: "3", label: "경기도 용인시" },
  { value: "4", label: "경기도 고양시" },
  { value: "7", label: "경기도 안산시" },
  { value: "8", label: "경기도 안양시" },
  { value: "9", label: "경상북도 포항시" },
  { value: "10", label: "경기도 의정부시" },
  { value: "11", label: "경기도 시흥시" },
  { value: "12", label: "경기도 평택시" },
  { value: "13", label: "경기도 김포시" },
  { value: "14", label: "경기도 광명시" },
  { value: "15", label: "경기도 군포시" },
  { value: "16", label: "경기도 하남시" },
  // 경상북도 시 추가
  { value: "17", label: "경상북도 울산시" },
  { value: "18", label: "경상북도 구미시" },
  { value: "19", label: "경상북도 경주시" },
  { value: "20", label: "경상북도 영주시" },
  { value: "21", label: "경상북도 안동시" },
  { value: "22", label: "경상북도 밀양시" },
  { value: "23", label: "경상북도 울주군" },
];

export const mockAccommodationOptions: ComboboxItem[] = [
  { value: "1", label: "호텔 (5성급)" },
  { value: "2", label: "호텔 (4성급)" },
  { value: "3", label: "호텔 (3성급 이하)" },
  { value: "4", label: "게스트하우스" },
  { value: "5", label: "캠핑 (시설 있음)" },
  { value: "6", label: "캠핑 (시설 없음)" },
  { value: "7", label: "친환경 인증 호텔" },
  { value: "8", label: "자가 숙박 (친척/지인 집)" },
];
