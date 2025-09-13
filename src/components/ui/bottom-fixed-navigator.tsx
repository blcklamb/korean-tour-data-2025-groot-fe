"use client";
import { usePathname, useRouter } from "next/navigation";
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
    <div className="fixed left-0 right-0 bottom-0 bg-white border-t border-gray-200 p-4">
      <div className="flex justify-evenly items-center max-w-md mx-auto">
        {/* 홈 */}
        <button
          onClick={() => handleNavigate("")}
          className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg transition-colors hover:text-eco-green-600 ${
            pathname === "/" ? "text-eco-green-600" : "text-gray-500"
          }`}
        >
          <IconHome width={24} height={24} />
          <div className="text-xs">홈</div>
        </button>

        {/* 생태관광 */}
        <button
          onClick={() => handleNavigate("eco-tourism-courses")}
          className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg transition-colors hover:text-eco-green-600 ${
            pathname === "/eco-tourism-courses"
              ? "text-eco-green-600"
              : "text-gray-500"
          }`}
        >
          <IconMapRoute width={24} height={24} />
          <div className="text-xs">생태관광</div>
        </button>

        {/* 인증 - CTA 스타일 (가운데 배치) */}
        <button
          onClick={() => handleNavigate("mission")}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-full shadow-lg transition-all ${
            pathname === "/mission"
              ? "bg-eco-green-600 text-white scale-105"
              : "bg-eco-green-500 text-white hover:bg-eco-green-600"
          }`}
        >
          <IconCameraFilled width={24} height={24} />
          <div className="text-xs font-medium">인증</div>
        </button>

        {/* 커뮤니티 */}
        <button
          onClick={() => handleNavigate("missions")}
          className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg transition-colors hover:text-eco-green-600 ${
            pathname === "/missions" ? "text-eco-green-600" : "text-gray-500"
          }`}
        >
          <IconUsersGroup width={24} height={24} />
          <div className="text-xs">커뮤니티</div>
        </button>
        {/* 마이 */}
        <button
          onClick={() => handleNavigate("my-page")}
          className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg transition-colors hover:text-eco-green-600 ${
            pathname === "/my-page" ? "text-eco-green-600" : "text-gray-500"
          }`}
        >
          <IconPlant width={24} height={24} />
          <div className="text-xs">마이페이지</div>
        </button>
      </div>
    </div>
  );
};

export default BottomFixedNavigator;
