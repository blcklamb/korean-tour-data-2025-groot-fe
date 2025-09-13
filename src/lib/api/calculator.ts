import apiClient from "./client";
import { TransportationType } from "@/types";

export const calculatorApi = {
  // 교통수단 타입 조회
  getTransportTypes: () => {
    return apiClient.get<TransportationType[]>(`/carbon/transportation-types`);
  },
};
