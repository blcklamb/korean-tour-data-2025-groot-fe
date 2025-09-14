"use client";

import { useParams, useRouter } from "next/navigation";
import { useCalculateCarbon } from "@/hooks/queries/useCalculator";
import { AppHeader } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ErrorFallback, LoadingState } from "@/components/fetch/data-state";
import { getRouteLabel, ROUTES } from "@/lib/routes";
import { IconLeaf, IconCar, IconBed, IconMapPin } from "@tabler/icons-react";
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

const CarbonCalculationResultPage = () => {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const calculateCarbon = useCalculateCarbon({
    // onSuccess: (data) => {},
    onError: (error) => {
      console.error("Carbon calculation failed:", error);
    },
  });

  useEffect(() => {
    if (sessionId && !calculateCarbon.data && !calculateCarbon.isPending) {
      calculateCarbon.mutate(sessionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, calculateCarbon.data, calculateCarbon.isPending]);

  const { data: result, isPending, error } = calculateCarbon;

  const goToMainPage = () => {
    router.push("/");
  };

  const shareResult = () => {
    router.push(`/carbon-calculation`);
  };

  const getCarbonLevelInfo = (emission: number) => {
    if (emission < 10) {
      return {
        level: "우수",
        color: "text-green-600 bg-green-50 border-green-200",
        icon: "🌱",
        message: "환경 친화적인 여행입니다!",
      };
    } else if (emission < 30) {
      return {
        level: "양호",
        color: "text-yellow-600 bg-yellow-50 border-yellow-200",
        icon: "🌿",
        message: "적당한 탄소 배출량입니다.",
      };
    } else {
      return {
        level: "개선 필요",
        color: "text-red-600 bg-red-50 border-red-200",
        icon: "🌍",
        message: "더 친환경적인 여행을 고려해보세요.",
      };
    }
  };

  const getHighestEmissionCategory = (resultData: typeof result) => {
    if (!resultData) return null;

    const { transportation, accommodation, course } = resultData.result;

    if (transportation >= accommodation && transportation >= course) {
      return {
        category: "transportation",
        name: "교통수단",
        icon: IconCar,
        tips: [
          "• 대중교통(버스, 지하철, 기차)을 이용해보세요",
          "• 가능하다면 카풀이나 렌터카 대신 대중교통을 선택하세요",
          "• 가까운 거리는 도보나 자전거를 이용해보세요",
        ],
      };
    } else if (accommodation >= transportation && accommodation >= course) {
      return {
        category: "accommodation",
        name: "숙박시설",
        icon: IconBed,
        tips: [
          "• 친환경 인증을 받은 호텔이나 펜션을 선택해보세요",
          "• 에너지 절약을 실천하는 숙소를 찾아보세요",
          "• 지역 민박이나 게스트하우스를 고려해보세요",
        ],
      };
    } else {
      return {
        category: "course",
        name: "관광 코스",
        icon: IconMapPin,
        tips: [
          "• 도보나 자전거로 둘러볼 수 있는 코스를 선택하세요",
          "• 대중교통으로 접근 가능한 관광지를 우선적으로 방문하세요",
          "• 지역 내 여러 관광지를 묶어서 효율적으로 이동하세요",
        ],
      };
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <AppHeader
        showBackButton
        onBackClick={() => router.back()}
        title={getRouteLabel(ROUTES.CARBON_CALCULATION)}
      />

      <LoadingState
        isLoading={isPending}
        message="탄소 배출량을 계산하는 중..."
      >
        <ErrorFallback
          error={!!error}
          message="탄소 배출량 계산 중 오류가 발생했습니다."
        >
          {result && (
            <div className="p-4 space-y-6">
              {/* 헤더 섹션 */}
              <div className="text-center space-y-2">
                <h1 className="text-xl font-semibold text-gray-800">
                  탄소 배출량 계산 결과
                </h1>
                <p className="text-gray-600">
                  {result.participantCount}명의 여행 탄소 배출량입니다
                </p>
              </div>

              {/* 총 배출량 카드 */}
              <Card className="p-6 bg-white border-2 border-green-100">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center">
                    <IconLeaf size={48} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-800">
                      {result.totalCarbonEmission}
                      <span className="text-lg ml-1">kg CO₂</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      총 탄소 배출량
                    </div>
                  </div>

                  {/* 등급 표시 */}
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${
                      getCarbonLevelInfo(result.totalCarbonEmission).color
                    }`}
                  >
                    <span className="text-lg">
                      {getCarbonLevelInfo(result.totalCarbonEmission).icon}
                    </span>
                    <span className="font-medium">
                      {getCarbonLevelInfo(result.totalCarbonEmission).level}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600">
                    {getCarbonLevelInfo(result.totalCarbonEmission).message}
                  </p>
                </div>
              </Card>

              {/* 상세 배출량 */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  배출량 상세 내역
                </h2>

                {/* 교통 배출량 */}
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconCar className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          교통수단
                        </div>
                        <div className="text-sm text-gray-500">
                          이동 관련 배출량
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">
                        {result.result.transportation} kg CO₂
                      </div>
                      <div className="text-xs text-gray-500">
                        {(
                          (result.result.transportation /
                            result.totalCarbonEmission) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress
                      value={
                        (result.result.transportation /
                          result.totalCarbonEmission) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                </Card>

                {/* 숙박 배출량 */}
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <IconBed className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          숙박시설
                        </div>
                        <div className="text-sm text-gray-500">
                          숙박 관련 배출량
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">
                        {result.result.accommodation} kg CO₂
                      </div>
                      <div className="text-xs text-gray-500">
                        {(
                          (result.result.accommodation /
                            result.totalCarbonEmission) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress
                      value={
                        (result.result.accommodation /
                          result.totalCarbonEmission) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                </Card>

                {/* 관광 코스 배출량 */}
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <IconMapPin className="text-green-600" size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          관광 코스
                        </div>
                        <div className="text-sm text-gray-500">
                          관광 관련 배출량
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">
                        {result.result.course} kg CO₂
                      </div>
                      <div className="text-xs text-gray-500">
                        {(
                          (result.result.course / result.totalCarbonEmission) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress
                      value={
                        (result.result.course / result.totalCarbonEmission) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                </Card>
              </div>

              {/* 개선 제안 */}
              {(() => {
                const highestCategory = getHighestEmissionCategory(result);
                if (!highestCategory) return null;

                const IconComponent = highestCategory.icon;

                return (
                  <Card className="p-4 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                    <div className="flex items-start gap-3">
                      <IconComponent
                        className="text-green-600 mt-1"
                        size={20}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-2">
                          💡 {highestCategory.name} 탄소 절약 팁
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">
                          가장 많은 탄소를 배출하는 {highestCategory.name} 개선
                          방안
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {highestCategory.tips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                );
              })()}

              {/* 액션 버튼들 */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={shareResult}
                  className="flex-1 gap-2"
                >
                  <RotateCcw size={16} />
                  다시 하기
                </Button>
                <Button onClick={goToMainPage} className="flex-1">
                  메인으로
                </Button>
              </div>

              {/* 결과 ID 표시 (디버깅용) */}
              {process.env.NODE_ENV === "development" && (
                <div className="text-center text-xs text-gray-400 pt-4">
                  Result ID: {result.resultId}
                </div>
              )}
            </div>
          )}
        </ErrorFallback>
      </LoadingState>
    </div>
  );
};

export default CarbonCalculationResultPage;
