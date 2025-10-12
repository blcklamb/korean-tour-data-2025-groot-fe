import { getXYToAddress } from "@/lib/api/kakao-map";
import { KakaoResponseAddress } from "@/types";
import { ApiError } from "@/types/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const useGetXYToAddress = (
  { x, y }: { x: number; y: number },
  options: Omit<
    UseQueryOptions<KakaoResponseAddress, ApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: ["kakaoMap", "xyToAddress", x, y],
    queryFn: () => getXYToAddress(x, y),
    enabled: !!x && !!y,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};
