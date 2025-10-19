"use client";

import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import LogoIcon from "./logo";
import { useAuth, useCurrentUser } from "@/hooks/queries";
import { Loader2 } from "lucide-react";

interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBackButton = false,
  onBackClick,
}) => {
  const { isLoggedIn } = useAuth();

  // 되도록 Logo가 있을 때는 title이 없어야 함
  const DYNAMIC_PADDING = useMemo(() => {
    if (showBackButton) {
      if (isLoggedIn) return 16;
      return 48;
    }
  }, [showBackButton, isLoggedIn]);

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="flex justify-between items-center w-full px-2 mx-auto h-16 ">
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
          <RightSection />
        </div>
      </div>
    </header>
  );
};

const RightSection = () => {
  const router = useRouter();

  const { data: user, isLoading } = useCurrentUser();
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();

  const onLoginClick = () => {
    router.push(ROUTES.LOGIN);
  };

  if (isAuthLoading) {
    return (
      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onLoginClick}
        className="text-green-600"
      >
        로그인
      </Button>
    );
  }

  if (isLoading) {
    return (
      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  return (
    <a
      href={ROUTES.MY_PAGE}
      className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold"
    >
      {user?.nickname[0]}
    </a>
  );
};
