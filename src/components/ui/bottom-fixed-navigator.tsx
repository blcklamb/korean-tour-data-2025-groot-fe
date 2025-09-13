"use client";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Camera, House, Map, Sprout, Users2Icon } from "lucide-react";

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
        <Button
          variant={"ghost"}
          onClick={() => handleNavigate("")}
          className={cn(
            "flex flex-col py-2 w-fit h-fit",
            pathname === "/" ? "text-eco-green-500" : "text-gray-500"
          )}
        >
          <House className="size-5" />
          <div className="text-xs">홈</div>
        </Button>

        {/* 생태관광 */}
        <Button
          variant={"ghost"}
          onClick={() => handleNavigate("eco-tourism-courses")}
          className={cn(
            "flex flex-col py-2 w-fit h-fit",
            pathname === "/eco-tourism-courses"
              ? "text-eco-green-500"
              : "text-gray-500"
          )}
        >
          <Map className="size-5" />
          <div className="text-xs">생태관광</div>
        </Button>

        {/* 인증 - CTA 스타일 (가운데 배치) */}
        <Button
          size={"lg"}
          onClick={() => handleNavigate("mission")}
          className={cn(
            "flex flex-col items-center gap-1 px-3 py-8 rounded-full shadow-lg transition-all",
            pathname === "/mission"
              ? "bg-eco-green-500 text-white scale-105"
              : "bg-eco-green-600 text-white hover:bg-eco-green-600"
          )}
        >
          <Camera className="size-6" />
          <div className="text-xs font-medium">인증</div>
        </Button>

        {/* 커뮤니티 */}
        <Button
          variant={"ghost"}
          onClick={() => handleNavigate("missions")}
          className={cn(
            "flex flex-col py-2 w-fit h-fit",
            pathname === "/missions" ? "text-eco-green-600" : "text-gray-500"
          )}
        >
          <Users2Icon className="size-5" />
          <div className="text-xs">커뮤니티</div>
        </Button>
        {/* 마이 */}
        <Button
          variant={"ghost"}
          onClick={() => handleNavigate("my-page")}
          className={cn(
            "flex flex-col py-2 w-fit h-fit",
            pathname === "/my-page" ? "text-eco-green-600" : "text-gray-500"
          )}
        >
          <Sprout className="size-5" />
          <div className="text-xs">마이페이지</div>
        </Button>
      </div>
    </div>
  );
};

export default BottomFixedNavigator;
