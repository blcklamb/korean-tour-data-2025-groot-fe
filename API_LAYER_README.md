# API & Query Layer 구조 가이드

## 📁 디렉토리 구조

```
src/
├── lib/
│   ├── api/                    # Request Layer (API 클라이언트)
│   │   ├── client.ts          # 기본 axios 클라이언트
│   │   ├── location.ts        # 위치/관광지 API
│   │   ├── carbon.ts          # 탄소 계산 API
│   │   ├── eco-tour.ts        # 에코 투어 API
│   │   ├── user.ts            # 사용자/미션/배지 API
│   │   └── index.ts           # API 통합 export
│   ├── query-client.tsx       # TanStack Query 설정
│   └── query-keys.ts          # Query Key 상수 관리
├── hooks/
│   └── queries/               # Query Layer (커스텀 훅)
│       ├── useLocation.ts     # 위치 관련 쿼리 훅
│       ├── useCarbon.ts       # 탄소 계산 쿼리 훅
│       ├── useEcoTour.ts      # 에코 투어 쿼리 훅
│       ├── useUser.ts         # 사용자 관련 쿼리 훅
│       └── index.ts           # 쿼리 훅 통합 export
├── types/
│   ├── api.ts                 # API 공통 타입
│   └── index.ts               # 도메인 타입
└── components/
    └── examples/
        └── ApiLayerExample.tsx # 사용 예시
```

## 🔧 설치된 패키지

- `@tanstack/react-query`: v5.x (최신 버전)
- `@tanstack/react-query-devtools`: 개발용 도구
- `axios`: HTTP 클라이언트

## 🏗️ 아키텍처 개요

### 1. Request Layer (`src/lib/api/`)

**역할**: 서버와의 HTTP 통신을 담당하는 계층

- **`client.ts`**: axios 기반 HTTP 클라이언트
  - 인터셉터를 통한 자동 인증 토큰 추가
  - 에러 처리 및 응답 표준화
  - 요청/응답 로깅
- **개별 API 파일들**: 도메인별로 분리된 API 함수들
  - RESTful API 패턴 적용
  - 타입 안전성 보장
  - 페이지네이션, 검색, 필터링 지원

### 2. Query Layer (`src/hooks/queries/`)

**역할**: TanStack Query를 활용한 서버 상태 관리

- **Query Hooks**: 데이터 페칭 및 캐싱
- **Mutation Hooks**: 데이터 변경 작업
- **Optimistic Updates**: 낙관적 업데이트 지원
- **Cache Invalidation**: 적절한 캐시 무효화

### 3. 타입 시스템 (`src/types/`)

**역할**: 전역 타입 정의 및 타입 안전성 보장

- **`api.ts`**: API 공통 타입 (응답 형식, 페이지네이션, 에러)
- **`index.ts`**: 비즈니스 도메인 타입 (Location, User, Mission 등)

## 📚 사용 방법

### 1. 기본 Query 사용법

```tsx
import { usePopularLocations } from "@/hooks/queries";

function PopularPlaces() {
  const { data, isLoading, error } = usePopularLocations(5);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error.message}</div>;

  return (
    <div>
      {data?.map((location) => (
        <div key={location.id}>{location.name}</div>
      ))}
    </div>
  );
}
```

### 2. 검색 Query 사용법

```tsx
import { useSearchLocations } from "@/hooks/queries";

function LocationSearch() {
  const [query, setQuery] = useState("");

  const { data, isLoading } = useSearchLocations(
    query,
    { limit: 10 },
    { enabled: query.length > 2 } // 3글자 이상일 때만 검색
  );

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {/* 검색 결과 표시 */}
    </div>
  );
}
```

### 3. Mutation 사용법

```tsx
import { useCreateCarbonCalculation } from "@/hooks/queries";

function CarbonCalculator() {
  const createCalculation = useCreateCarbonCalculation({
    onSuccess: (data) => {
      alert("계산 완료!");
    },
    onError: (error) => {
      alert("오류 발생: " + error.message);
    },
  });

  const handleSubmit = () => {
    createCalculation.mutate({
      routes: [
        /* 경로 데이터 */
      ],
      accommodations: [
        /* 숙박 데이터 */
      ],
    });
  };

  return (
    <button onClick={handleSubmit} disabled={createCalculation.isPending}>
      계산하기
    </button>
  );
}
```

## 🎯 Best Practices

### 1. Query Key 관리

- `src/lib/query-keys.ts`에서 중앙 집중 관리
- 계층적 구조로 조직화
- 타입 안전성 보장

```tsx
// ✅ 좋은 예
const { data } = useLocation(id);

// ❌ 나쁜 예 - 직접 useQuery 사용
const { data } = useQuery({
  queryKey: ["locations", id],
  queryFn: () => locationApi.getLocation(id),
});
```

### 2. 캐시 전략

- **staleTime**: 데이터 특성에 따라 조정

  - 실시간 데이터: 0ms
  - 준정적 데이터: 5-10분
  - 정적 데이터: 30분 이상

- **invalidateQueries**: 관련 데이터 자동 갱신

```tsx
// 데이터 생성 후 관련 쿼리 무효화
onSuccess: (data) => {
  queryClient.invalidateQueries({
    queryKey: queryKeys.locations.lists(),
  });
};
```

### 3. 에러 처리

- API 레벨에서 일관된 에러 형식 제공
- Query 레벨에서 사용자 친화적 에러 처리
- 전역 에러 경계 설정

### 4. 로딩 상태 관리

- `isLoading`: 초기 로딩
- `isFetching`: 백그라운드 리페칭
- `isPending`: Mutation 진행 중

### 5. 성능 최적화

- **Prefetching**: 사용자가 필요로 할 데이터 미리 로드
- **Pagination**: 큰 데이터셋의 점진적 로딩
- **Infinite Queries**: 무한 스크롤 지원

## 🔄 캐시 무효화 전략

### 자동 무효화

```tsx
// 새 데이터 생성 시
onSuccess: (data) => {
  // 목록 쿼리 무효화
  queryClient.invalidateQueries({
    queryKey: queryKeys.locations.lists(),
  });

  // 새 데이터를 캐시에 직접 설정
  queryClient.setQueryData(queryKeys.locations.detail(data.id), data);
};
```

### 관련 데이터 업데이트

```tsx
// 미션 완료 시 여러 관련 데이터 업데이트
onSuccess: (data, variables) => {
  // 미션 목록 무효화
  queryClient.invalidateQueries({
    queryKey: queryKeys.missions.user(variables.userId),
  });

  // 사용자 통계 무효화 (포인트 변경)
  queryClient.invalidateQueries({
    queryKey: queryKeys.users.stats(variables.userId),
  });

  // 배지 확인 (새 배지 해금 가능성)
  queryClient.invalidateQueries({
    queryKey: queryKeys.badges.user(variables.userId),
  });
};
```

## 🐛 디버깅

### TanStack Query DevTools

개발 모드에서 자동으로 실행되며, 다음 정보를 제공합니다:

- 활성 쿼리 상태
- 캐시된 데이터
- 네트워크 요청 로그
- 에러 정보

### 일반적인 문제 해결

1. **데이터가 업데이트되지 않음**

   - Query key가 올바른지 확인
   - Cache invalidation이 제대로 되는지 확인

2. **무한 리페칭**

   - Query key에 객체가 포함되어 있는지 확인
   - 의존성 배열 안정성 확인

3. **메모리 누수**
   - 컴포넌트 언마운트 시 query 취소
   - 적절한 staleTime 설정

## 🚀 확장 가능성

### 새로운 API 추가

1. `src/lib/api/`에 새 API 파일 생성
2. `src/hooks/queries/`에 해당 쿼리 훅 생성
3. `src/lib/query-keys.ts`에 새 쿼리 키 추가
4. 타입 정의 업데이트

### 오프라인 지원

TanStack Query의 내장 오프라인 지원을 활용:

```tsx
const { data } = useLocations(params, {
  networkMode: "offlineFirst", // 오프라인 우선
});
```

### 실시간 업데이트

WebSocket과 연동하여 실시간 데이터 업데이트:

```tsx
// WebSocket 메시지 수신 시
queryClient.setQueryData(queryKeys.missions.user(userId), (old) =>
  updateMissionProgress(old, newProgress)
);
```

이 구조는 확장 가능하고 유지보수하기 쉬운 API 계층을 제공하여, 향후 기능 추가나 변경에 유연하게 대응할 수 있습니다.
