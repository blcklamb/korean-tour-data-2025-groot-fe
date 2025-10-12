import { KakaoResponseAddress } from "@/types";

/**
 * Kakao Map API 관련 API 함수 - 좌표로 주소 변환
 */
export const getXYToAddress = async (
  x: number,
  y: number
): Promise<KakaoResponseAddress> => {
  const response = await fetch(
    `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${x}&y=${y}`,
    {
      headers: {
        Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch address from coordinates");
  }

  const data = await response.json();
  const address = data.documents[0]?.address;
  return address;
};
