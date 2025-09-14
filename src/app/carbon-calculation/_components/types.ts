export interface ComboboxItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export type CarbonCalculationStep =
  | "PERSONNEL"
  | "ROUTE+ECO_COURSES"
  | "ACCOMMODATION";

export interface CarbonCalculatorFormValues {
  personnel: number;
  // todo: naming
  routes: {
    departureLocationId?: number;
    arrivalLocationId?: number;
    courseId?: number; // 생태 관광 코스 ID
    transportationTypeId: number;
  }[];
  accommodation: {
    accommodationTypeId: string;
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
