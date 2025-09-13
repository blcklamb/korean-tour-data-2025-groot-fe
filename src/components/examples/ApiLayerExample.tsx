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
import {
  Button,
  TextInput,
  Stack,
  Card,
  Text,
  Group,
  Badge,
  Loader,
} from "@mantine/core";

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
    <Stack>
      <TextInput
        label="장소 검색"
        placeholder="관광지명을 입력하세요"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {searchQuery.length > 2 ? (
        <div>
          <Text fw={500} mb="sm">
            검색 결과
          </Text>
          {searchLoading ? (
            <Loader size="sm" />
          ) : (
            <Stack gap="xs">
              {searchResults?.data.map((location) => (
                <Card key={location.id} withBorder>
                  <Text fw={500}>{location.name}</Text>
                  <Text size="sm" c="dimmed">
                    {location.address}
                  </Text>
                  <Badge variant="light">{location.category}</Badge>
                </Card>
              ))}
            </Stack>
          )}
        </div>
      ) : (
        <div>
          <Text fw={500} mb="sm">
            인기 관광지
          </Text>
          {popularLoading ? (
            <Loader size="sm" />
          ) : (
            <Stack gap="xs">
              {popularLocations?.map((location) => (
                <Card key={location.id} withBorder>
                  <Text fw={500}>{location.name}</Text>
                  <Text size="sm" c="dimmed">
                    {location.address}
                  </Text>
                  <Group gap="xs">
                    <Badge variant="light">{location.category}</Badge>
                    {location.rating && (
                      <Badge color="yellow">⭐ {location.rating}</Badge>
                    )}
                  </Group>
                </Card>
              ))}
            </Stack>
          )}
        </div>
      )}
    </Stack>
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
    <Stack>
      <Group>
        <Text fw={500}>탄소 계산</Text>
        <Button
          onClick={handleCalculateCarbon}
          loading={createCalculation.isPending}
        >
          새 계산 만들기
        </Button>
      </Group>

      <div>
        <Text fw={500} mb="sm">
          최근 계산 기록
        </Text>
        {isLoading ? (
          <Loader size="sm" />
        ) : (
          <Stack gap="xs">
            {calculations?.data.map((calc) => (
              <Card key={calc.id} withBorder>
                <Group justify="space-between">
                  <div>
                    <Text fw={500}>여행 기록</Text>
                    <Text size="sm" c="dimmed">
                      경로 {calc.routes.length}개, 숙박{" "}
                      {calc.accommodations.length}곳
                    </Text>
                  </div>
                  <Badge color="green" size="lg">
                    {calc.totalCarbon.toFixed(1)}kg CO₂
                  </Badge>
                </Group>
              </Card>
            ))}
          </Stack>
        )}
      </div>
    </Stack>
  );
}

// 3. 사용자 프로그레스 예시
function UserProgressExample() {
  const [userId] = useState("user-123");

  const { user, stats, badges, activeMissions, isLoading } =
    useUserProgress(userId);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Stack>
      <Card withBorder>
        <Text fw={500} mb="sm">
          사용자 정보
        </Text>
        <Text>이름: {user?.name}</Text>
        <Text>레벨: {stats?.level}</Text>
        <Text>포인트: {stats?.totalPoints}</Text>
        <Text>탄소 절약량: {stats?.carbonSaved}kg CO₂</Text>
      </Card>

      <Card withBorder>
        <Text fw={500} mb="sm">
          배지 ({stats?.badgesCount}개)
        </Text>
        <Group gap="xs">
          {badges
            ?.filter((badge) => badge.unlocked)
            .map((badge) => (
              <Badge key={badge.id} variant="filled">
                {badge.icon} {badge.name}
              </Badge>
            ))}
        </Group>
      </Card>

      <Card withBorder>
        <Text fw={500} mb="sm">
          진행 중인 미션
        </Text>
        <Stack gap="xs">
          {activeMissions?.map((mission) => (
            <div key={mission.id}>
              <Group justify="space-between">
                <Text size="sm">{mission.title}</Text>
                <Badge variant="light">
                  {mission.progress}/{mission.target}
                </Badge>
              </Group>
            </div>
          ))}
        </Stack>
      </Card>
    </Stack>
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
    <Stack>
      <div>
        <Text fw={500} mb="sm">
          맞춤 추천 코스
        </Text>
        {recommendedLoading ? (
          <Loader size="sm" />
        ) : (
          <Stack gap="xs">
            {recommended?.map((course) => (
              <Card key={course.id} withBorder>
                <Text fw={500}>{course.title}</Text>
                <Text size="sm" c="dimmed" lineClamp={2}>
                  {course.description}
                </Text>
                <Group gap="xs" mt="xs">
                  <Badge variant="light">{course.difficulty}</Badge>
                  <Badge color="green">{course.duration}분</Badge>
                  <Badge color="blue">-{course.carbonReduction}kg CO₂</Badge>
                </Group>
              </Card>
            ))}
          </Stack>
        )}
      </div>

      <div>
        <Text fw={500} mb="sm">
          쉬운 난이도 코스
        </Text>
        {allLoading ? (
          <Loader size="sm" />
        ) : (
          <Stack gap="xs">
            {allCourses?.data.map((course) => (
              <Card key={course.id} withBorder>
                <Group justify="space-between">
                  <div>
                    <Text fw={500}>{course.title}</Text>
                    <Text size="sm" c="dimmed">
                      ⭐ {course.rating} ({course.reviewCount}개 리뷰)
                    </Text>
                  </div>
                  <Badge color="green">{course.duration}분</Badge>
                </Group>
              </Card>
            ))}
          </Stack>
        )}
      </div>
    </Stack>
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
      <Text size="xl" fw={700} mb="lg">
        API Layer 사용 예시
      </Text>

      <Group mb="md">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "filled" : "light"}
            onClick={() => setActiveTab(tab.key)}
            size="sm"
          >
            {tab.label}
          </Button>
        ))}
      </Group>

      {tabs.find((tab) => tab.key === activeTab)?.component}
    </div>
  );
}
