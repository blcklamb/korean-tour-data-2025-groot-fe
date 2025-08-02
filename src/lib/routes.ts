export enum ROUTES {
  HOME = "/",
  CARBON_CALCULATION = "/carbon-calculation",
  MISSION = "/mission",
  MISSIONS = "/missions",
  MISSIONS_MY_RESULTS = "/missions/my-results",
  LOGIN = "/login",
  ONBOARDING = "/onboarding",
  MY_PAGE = "/my-page",
  MY_PAGE_SHARE_HISTORY = "/my-page/share-history",
  ECO_TOURISM_COURSES = "/eco-tourism-courses",
  BADGES = "/badges",
}

export const routeInfo: {
  href: ROUTES;
  label: string;
  query: Record<string, string>;
}[] = [
  { href: ROUTES.HOME, label: "홈", query: {} },
  { href: ROUTES.CARBON_CALCULATION, label: "탄소배출량 계산", query: {} },
  { href: ROUTES.MISSION, label: "미션 수행", query: {} },
  {
    href: ROUTES.MISSIONS_MY_RESULTS,
    label: "나의 미션 수행 결과 리스트 조회",
    query: {},
  },
  {
    href: ROUTES.MISSIONS,
    label: "다른 유저 미션 결과 리스트 조회",
    query: {},
  },
  { href: ROUTES.LOGIN, label: "로그인", query: {} },
  { href: ROUTES.ONBOARDING, label: "온보딩", query: {} },
  { href: ROUTES.MY_PAGE, label: "마이 페이지", query: {} },
  {
    href: ROUTES.MY_PAGE_SHARE_HISTORY,
    label: "공유 히스토리 조회",
    query: {},
  },
  {
    href: ROUTES.ECO_TOURISM_COURSES,
    label: "생태 관광 코스 목록 조회",
    query: {},
  },
  { href: ROUTES.BADGES, label: "뱃지 수집 현황", query: {} },
];

export const getRouteLabel = (route: ROUTES) => {
  return routeInfo.filter((_route) => _route.href === route)[0].label;
};

export default routeInfo;
