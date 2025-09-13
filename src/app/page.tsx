import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 pt-5">
      <Button asChild>
        <Link href={ROUTES.CARBON_CALCULATION}>탄소배출량 계산</Link>
      </Button>
      <Button asChild>
        <Link href={ROUTES.MISSION}>미션 수행</Link>
      </Button>
      <Button asChild>
        <Link href={ROUTES.MISSIONS_MY_RESULTS}>
          나의 미션 수행 결과 리스트 조회
        </Link>
      </Button>
      <Button asChild>
        <Link href={ROUTES.MISSIONS}>다른 유저 미션 결과 리스트 조회</Link>
      </Button>
      <Button asChild>
        <Link href={ROUTES.LOGIN}>로그인</Link>
      </Button>
      <Button asChild>
        <Link href={ROUTES.ONBOARDING}>온보딩</Link>
      </Button>
      <Button asChild>
        <Link href={ROUTES.MY_PAGE}>마이 페이지</Link>
      </Button>
      <Button asChild>
        <Link href={ROUTES.MY_PAGE_SHARE_HISTORY}>공유 히스토리 조회</Link>
      </Button>
      <Button asChild>
        <Link href={ROUTES.ECO_TOURISM_COURSES}>생태 관광 코스 목록 조회</Link>
      </Button>
      <Button asChild>
        <Link href={ROUTES.BADGES}>뱃지 수집 현황</Link>
      </Button>
    </div>
  );
}
