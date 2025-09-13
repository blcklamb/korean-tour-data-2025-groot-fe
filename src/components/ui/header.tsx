"use client";

import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import LogoIcon from "./logo";

interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title = "탄소배출량 계산",
  showBackButton = false,
  onBackClick,
}) => {
  const router = useRouter();
  const isLogin = false; // 임시 로그인 상태
  const tempUser = {
    name: "홍길동",
  };

  const onLoginClick = () => {
    router.push(ROUTES.LOGIN);
  };

  // 되도록 Logo가 있을 때는 title이 없어야 함
  const DYNAMIC_PADDING = useMemo(() => {
    if (showBackButton) {
      if (isLogin) return 16;
      return 48;
    }
  }, [showBackButton, isLogin]);

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="flex justify-between items-center w-full max-w-md mx-auto h-16 px-4">
        {/* 왼쪽 영역 */}
        <div className="flex items-center gap-2">
          {showBackButton ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              className="p-2"
            >
              <IconArrowLeft />
            </Button>
          ) : (
            <div className="flex gap-2 items-center">
              <LogoIcon />
              <h3 className="text-xl font-bold text-green-600">Groot</h3>
            </div>
          )}
        </div>

        {/* 중앙 영역 - 페이지 타이틀 */}
        {title && (
          <div
            className="flex-1 flex justify-center"
            style={{
              paddingInlineStart: DYNAMIC_PADDING,
            }}
          >
            <h4 className="text-lg font-semibold">{title}</h4>
          </div>
        )}

        {/* 오른쪽 영역 */}
        <div className="flex items-center">
          {isLogin && (
            <a
              href={ROUTES.MY_PAGE}
              className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold"
            >
              {tempUser.name[0] || "U"}
            </a>
          )}
          {!isLogin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLoginClick}
              className="text-green-600"
            >
              로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
