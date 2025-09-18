"use client";

import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Calculator,
  Leaf,
  MapPin,
  Users,
  TreePine,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AppHeader } from "@/components/ui/header";
import { useCurrentUser } from "@/hooks/queries";

interface Banner {
  id: number;
  title: string;
  content: string;
  color: string;
}

export default function Home() {
  const router = useRouter();

  const [currentBanner, setCurrentBanner] = useState(0);

  const { data: user } = useCurrentUser();

  // 배너 데이터
  const banners: Banner[] = [
    {
      id: 1,
      title: "생태관광으로 지구를 지키세요",
      content: "친환경 여행으로 탄소발자국을 줄여보세요",
      color: "bg-green-100",
    },
    {
      id: 2,
      title: "그루와 함께하는 여행",
      content: "지속가능한 관광을 통해 환경을 보호합니다",
      color: "bg-blue-100",
    },
    {
      id: 3,
      title: "미션을 완수하고 뱃지를 획득하세요",
      content: "재미있는 미션들을 통해 환경 의식을 높여보세요",
      color: "bg-yellow-100",
    },
  ];

  // 라우트 카드 데이터
  const routeCards = [
    {
      id: 1,
      title: "그루맵 트래킹",
      description: "생태관광 코스 목록 조회",
      icon: <MapPin className="w-8 h-8" />,
      path: ROUTES.ECO_TOURISM_COURSES,
    },
    {
      id: 2,
      title: "그루의 발자국",
      description: "미션 수행",
      icon: <Leaf className="w-8 h-8" />,
      path: ROUTES.MISSIONS,
    },
    {
      id: 3,
      title: "그루미터",
      description: "탄소배출량 계산",
      icon: <Calculator className="w-8 h-8" />,
      path: ROUTES.CARBON_CALCULATION,
    },
    {
      id: 4,
      title: "챌린지 포레스트",
      description: "뱃지 모아보기",
      icon: <Users className="w-8 h-8" />,
      path: ROUTES.BADGES,
    },
  ];

  // 이벤트 핸들러
  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const handleShowLoginFlow = () => {
    router.push(ROUTES.LOGIN);
  };

  const handleShowOnboarding = () => {
    router.push(ROUTES.ONBOARDING);
  };

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <AppHeader />
      {/* 히어로 섹션 - 배너 캐러셀 */}
      <div className="bg-white p-4">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Card className={`${banners[currentBanner].color} border-0`}>
              <CardContent className="p-6 text-center">
                <h3 className="text-lg mb-2">{banners[currentBanner].title}</h3>
                <p className="text-sm text-gray-600">
                  {banners[currentBanner].content}
                </p>
              </CardContent>
            </Card>

            {/* 캐러셀 네비게이션 */}
            <div className="flex justify-between items-center mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevBanner}
                className="p-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex space-x-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentBanner ? "bg-green-600" : "bg-gray-300"
                    }`}
                    onClick={() => setCurrentBanner(index)}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={nextBanner}
                className="p-2"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* 가이드 페이지 버튼 */}
          <Card>
            <CardContent className="p-4">
              <Button
                onClick={handleShowOnboarding}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <TreePine className="w-4 h-4 mr-2" />
                서비스 가이드 보기
              </Button>
            </CardContent>
          </Card>

          {/* 로그인/상태 섹션 */}
          {!user?.nickname ? (
            <Card>
              <CardContent className="p-4 text-center">
                <p className="mb-4">로그인하고 미션을 시작해보세요!</p>
                <Button onClick={handleShowLoginFlow} className="w-full">
                  <UserIcon className="w-4 h-4 mr-2" />
                  로그인하기
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.nickname[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{user.nickname}</h3>
                    <p className="text-sm text-gray-600">
                      레벨 {user.level} • 탄소절약 {user.carbonSaved}kg
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavigate(ROUTES.MY_PAGE)}
                  >
                    마이페이지
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 메인 기능 카드 그룹 */}
          <div className="grid grid-cols-2 gap-4">
            {routeCards.map((card) => (
              <Card
                key={card.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleNavigate(card.path)}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-3 text-green-600">
                    {card.icon}
                  </div>
                  <h3 className="font-semibold mb-1">{card.title}</h3>
                  <p className="text-xs text-gray-600">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
