// API와 Query Layer 사용 예시
"use client";

import { useState } from "react";
import {
  usePopularLocations,
  useSearchLocations,
  useCreateCarbonCalculation,
  useUserCarbonCalculations,
  useUserProgress,
  useEcoTourCourses,
  useRecommendedEcoTours,
} from "@/hooks/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

// 1. 위치 검색 예시
function LocationSearchExample() {
  const [searchQuery, setSearchQuery] = useState("");

  // 인기 위치 조회
  const { data: popularLocations, isLoading: popularLoading } =
    usePopularLocations(5);

  // 검색 쿼리가 있을 때만 검색 실행
  const { data: searchResults, isLoading: searchLoading } = useSearchLocations(
    searchQuery,
    { limit: 10 },
    { enabled: searchQuery.length > 2 } // 3글자 이상일 때만 검색
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">장소 검색</label>
        <Input
          placeholder="관광지명을 입력하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {searchQuery.length > 2 ? (
        <div>
          <h3 className="font-medium mb-3">검색 결과</h3>
          {searchLoading ? (
            <div className="flex justify-center">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {searchResults?.data.map((location) => (
                <Card key={location.id} className="p-4">
                  <h4 className="font-medium">{location.name}</h4>
                  <p className="text-sm text-gray-500">{location.address}</p>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                    {location.category}
                  </span>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h3 className="font-medium mb-3">인기 관광지</h3>
          {popularLoading ? (
            <div className="flex justify-center">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {popularLocations?.map((location) => (
                <Card key={location.id} className="p-4">
                  <h4 className="font-medium">{location.name}</h4>
                  <p className="text-sm text-gray-500">{location.address}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {location.category}
                    </span>
                    {location.rating && (
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        ⭐ {location.rating}
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 2. 탄소 계산 예시
function CarbonCalculationExample() {
  const [userId] = useState("user-123"); // 실제로는 인증에서 가져옴

  // 사용자의 탄소 계산 기록 조회
  const { data: calculations, isLoading } = useUserCarbonCalculations(userId, {
    limit: 5,
  });

  // 새로운 탄소 계산 생성 mutation
  const createCalculation = useCreateCarbonCalculation({
    onSuccess: () => {
      alert("탄소 계산이 완료되었습니다!");
    },
    onError: (error) => {
      alert(`오류: ${error.message}`);
    },
  });

  const handleCalculateCarbon = () => {
    createCalculation.mutate({
      routes: [
        {
          from: {
            id: "1",
            name: "서울역",
            address: "서울 중구",
            lat: 37.5547,
            lng: 126.9707,
            category: "station",
          },
          to: {
            id: "2",
            name: "부산역",
            address: "부산 동구",
            lat: 35.1154,
            lng: 129.0425,
            category: "station",
          },
          transportType: "train",
          distance: 400000, // 400km
        },
      ],
      accommodations: [
        {
          name: "친환경 호텔",
          type: "hotel",
          nights: 2,
        },
      ],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="font-medium">탄소 계산</h3>
        <Button
          onClick={handleCalculateCarbon}
          disabled={createCalculation.isPending}
        >
          {createCalculation.isPending ? "계산 중..." : "새 계산 만들기"}
        </Button>
      </div>

      <div>
        <h3 className="font-medium mb-3">최근 계산 기록</h3>
        {isLoading ? (
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {calculations?.data.map((calc) => (
              <Card key={calc.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">여행 기록</h4>
                    <p className="text-sm text-gray-500">
                      경로 {calc.routes.length}개, 숙박{" "}
                      {calc.accommodations.length}곳
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-lg font-medium">
                    {calc.totalCarbon.toFixed(1)}kg CO₂
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 3. 사용자 프로그레스 예시
function UserProgressExample() {
  const [userId] = useState("user-123");

  const { user, stats, badges, activeMissions, isLoading } =
    useUserProgress(userId);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-medium mb-3">사용자 정보</h3>
        <p>이름: {user?.name}</p>
        <p>레벨: {stats?.level}</p>
        <p>포인트: {stats?.totalPoints}</p>
        <p>탄소 절약량: {stats?.carbonSaved}kg CO₂</p>
      </Card>

      <Card className="p-4">
        <h3 className="font-medium mb-3">배지 ({stats?.badgesCount}개)</h3>
        <div className="flex gap-2 flex-wrap">
          {badges
            ?.filter((badge) => badge.unlocked)
            .map((badge) => (
              <span
                key={badge.id}
                className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
              >
                {badge.icon} {badge.name}
              </span>
            ))}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-medium mb-3">진행 중인 미션</h3>
        <div className="space-y-2">
          {activeMissions?.map((mission) => (
            <div key={mission.id} className="flex justify-between items-center">
              <p className="text-sm">{mission.title}</p>
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                {mission.progress}/{mission.target}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// 4. 에코 투어 추천 예시
function EcoTourRecommendationExample() {
  const [userId] = useState("user-123");

  // 사용자 맞춤 추천
  const { data: recommended, isLoading: recommendedLoading } =
    useRecommendedEcoTours(userId, 3);

  // 전체 코스 목록 (필터링)
  const { data: allCourses, isLoading: allLoading } = useEcoTourCourses({
    difficulty: "easy",
    limit: 5,
  });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-3">맞춤 추천 코스</h3>
        {recommendedLoading ? (
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {recommended?.map((course) => (
              <Card key={course.id} className="p-4">
                <h4 className="font-medium">{course.title}</h4>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {course.description}
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                    {course.difficulty}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    {course.duration}분
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    -{course.carbonReduction}kg CO₂
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="font-medium mb-3">쉬운 난이도 코스</h3>
        {allLoading ? (
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {allCourses?.data.map((course) => (
              <Card key={course.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{course.title}</h4>
                    <p className="text-sm text-gray-500">
                      ⭐ {course.rating} ({course.reviewCount}개 리뷰)
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    {course.duration}분
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 메인 예시 컴포넌트
export default function ApiLayerExample() {
  const [activeTab, setActiveTab] = useState("locations");

  const tabs = [
    {
      key: "locations",
      label: "위치 검색",
      component: <LocationSearchExample />,
    },
    {
      key: "carbon",
      label: "탄소 계산",
      component: <CarbonCalculationExample />,
    },
    {
      key: "progress",
      label: "사용자 진행상황",
      component: <UserProgressExample />,
    },
    {
      key: "ecotour",
      label: "에코투어 추천",
      component: <EcoTourRecommendationExample />,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">API Layer 사용 예시</h1>

      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "outline"}
            onClick={() => setActiveTab(tab.key)}
            size="sm"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {tabs.find((tab) => tab.key === activeTab)?.component}
    </div>
  );
}
