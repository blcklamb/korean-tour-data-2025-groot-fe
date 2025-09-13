import { calculatorApi } from "@/lib/api/calculator";
import { queryKeys } from "@/lib/query-keys";
import { TransportationType } from "@/types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";

// 교통수단 타입 조회
export const useGetTransportationTypes = (
  options?: Omit<
    UseQueryOptions<TransportationType[], ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.carbon.transport(),
    queryFn: () => calculatorApi.getTransportTypes().then((res) => res.data),
    ...options,
  });
};
