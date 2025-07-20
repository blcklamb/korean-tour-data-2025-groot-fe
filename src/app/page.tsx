import Link from "next/link";
import styles from "./page.module.css";
import { Button } from "@mantine/core";

export default function Home() {
  return (
    <div className={styles.pageGrid}>
      <Button component={Link} href="/carbon-calculation">
        탄소배출량 계산
      </Button>
      <Button component={Link} href="/mission">
        미션 수행
      </Button>
      <Button component={Link} href="/missions/my-results">
        나의 미션 수행 결과 리스트 조회
      </Button>
      <Button component={Link} href="/missions">
        다른 유저 미션 결과 리스트 조회
      </Button>
      <Button component={Link} href="/login">
        로그인
      </Button>
      <Button component={Link} href="/onboarding">
        온보딩
      </Button>
      <Button component={Link} href="/my-page">
        마이 페이지
      </Button>
      <Button component={Link} href="/my-page/share-history">
        공유 히스토리 조회
      </Button>
      <Button component={Link} href="/eco-tourism-courses">
        생태 관광 코스 목록 조회
      </Button>

      <Button component={Link} href="/badges">
        뱃지 수집 현황
      </Button>
    </div>
  );
}
