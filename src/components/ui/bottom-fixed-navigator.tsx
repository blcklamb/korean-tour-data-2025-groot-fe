"use client";
import { usePathname, useRouter } from "next/navigation";
import styles from "./ui.module.css";
import { UnstyledButton } from "@mantine/core";
import {
  IconCameraFilled,
  IconHome,
  IconMapRoute,
  IconPlant,
  IconUsersGroup,
} from "@tabler/icons-react";

const BottomFixedNavigator = () => {
  const pathname = usePathname();
  const router = useRouter();
  const handleNavigate = (pages: string) => {
    router.push(`/${pages}`);
  };

  return (
    <div className={styles.fixedBottom}>
      <div className={styles.navigatorWrap}>
        {/* 홈 */}
        <UnstyledButton
          onClick={() => handleNavigate("")}
          className={`${styles.btn}
           ${pathname === "/" ? styles.btnActive : styles.btnInactive}
        `}
        >
          <IconHome width={"24"} height={"24"} />
          <div className={styles.textXs}>홈</div>
        </UnstyledButton>

        {/* 생태관광 */}
        <UnstyledButton
          onClick={() => handleNavigate("eco-tourism-courses")}
          className={`${styles.btn}
           ${
             pathname === "/eco-tourism-courses"
               ? styles.btnActive
               : styles.btnInactive
           }
        `}
        >
          <IconMapRoute width={"24"} height={"24"} />
          <div className={styles.textXs}>생태관광</div>
        </UnstyledButton>

        {/* 인증 - CTA 스타일 (가운데 배치) */}
        <UnstyledButton
          onClick={() => handleNavigate("mission")}
          className={`${styles.cta} ${
            pathname === "missions" ? styles.ctaActive : styles.ctaInactive
          }`}
        >
          <IconCameraFilled width={"24"} height={"24"} />
          <div className={styles.textXs}>인증</div>
        </UnstyledButton>

        {/* 커뮤니티 */}
        <UnstyledButton
          onClick={() => handleNavigate("missions")}
          className={`${styles.btn}
           ${pathname === "/missions" ? styles.btnActive : styles.btnInactive}
        `}
        >
          <IconUsersGroup width={"24"} height={"24"} />
          <div className={styles.textXs}>커뮤니티</div>
        </UnstyledButton>
        {/* 마이 */}
        <UnstyledButton
          onClick={() => handleNavigate("my-page")}
          className={`${styles.btn}
           ${pathname === "/my-page" ? styles.btnActive : styles.btnInactive}
        `}
        >
          <IconPlant width={"24"} height={"24"} />
          <div className={styles.textXs}>마이페이지</div>
        </UnstyledButton>
      </div>
    </div>
  );
};

export default BottomFixedNavigator;
