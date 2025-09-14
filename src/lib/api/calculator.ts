import apiClient from "./client";
import { AccommodationType, TransportationType } from "@/types";

export const calculatorApi = {
  // 교통수단 타입 조회
  getTransportTypes: () => {
    return apiClient.get<TransportationType[]>(`/carbon/transportation-types`);
  },

  // 숙박 타입 조회
  getAccommodationTypes: () => {
    return apiClient.get<AccommodationType[]>(`/carbon/accommodation-types`);
  },
};
