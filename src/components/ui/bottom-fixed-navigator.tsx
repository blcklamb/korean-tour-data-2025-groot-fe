"use client";
import { usePathname, useRouter } from "next/navigation";
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
    <div className="fixed left-0 right-0 bottom-0 bg-white border-t border-gray-200 p-xl">
      <div className="flex justify-evenly items-center max-w-md mx-auto">
        {/* 홈 */}
        <UnstyledButton
          onClick={() => handleNavigate("")}
          className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg transition-colors bg-transparent border-none w-fit hover:text-green-600 ${
            pathname === "/" ? "text-green-600" : "text-gray-500"
          }`}
        >
          <IconHome width={"24"} height={"24"} />
          <div className="text-xs">홈</div>
        </UnstyledButton>

        {/* 생태관광 */}
        <UnstyledButton
          onClick={() => handleNavigate("eco-tourism-courses")}
          className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg transition-colors bg-transparent border-none w-fit hover:text-green-600 ${
            pathname === "/eco-tourism-courses"
              ? "text-green-600"
              : "text-gray-500"
          }`}
        >
          <IconMapRoute width={"24"} height={"24"} />
          <div className="text-xs">생태관광</div>
        </UnstyledButton>

        {/* 인증 - CTA 스타일 (가운데 배치) */}
        <UnstyledButton
          onClick={() => handleNavigate("mission")}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-full shadow-lg transition-all border-none w-fit ${
            pathname === "missions"
              ? "bg-green-600 text-white scale-105"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          <IconCameraFilled width={"24"} height={"24"} />
          <div className="text-xs font-medium">인증</div>
        </UnstyledButton>

        {/* 커뮤니티 */}
        <UnstyledButton
          onClick={() => handleNavigate("missions")}
          className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg transition-colors bg-transparent border-none w-fit hover:text-green-600 ${
            pathname === "/missions" ? "text-green-600" : "text-gray-500"
          }`}
        >
          <IconUsersGroup width={"24"} height={"24"} />
          <div className="text-xs">커뮤니티</div>
        </UnstyledButton>
        {/* 마이 */}
        <UnstyledButton
          onClick={() => handleNavigate("my-page")}
          className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg transition-colors bg-transparent border-none w-fit hover:text-green-600 ${
            pathname === "/my-page" ? "text-green-600" : "text-gray-500"
          }`}
        >
          <IconPlant width={"24"} height={"24"} />
          <div className="text-xs">마이페이지</div>
        </UnstyledButton>
      </div>
    </div>
  );
};

export default BottomFixedNavigator;
