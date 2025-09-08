"use client";

import { ROUTES } from "@/lib/routes";
import {
  AppShellHeader,
  Avatar,
  Button,
  Flex,
  Title,
  UnstyledButton,
} from "@mantine/core";
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
    <AppShellHeader>
      <div className="flex justify-between items-center w-full max-w-md mx-auto h-full">
        {/* 왼쪽 영역 */}
        <Flex align="center" gap="xs">
          {showBackButton ? (
            <UnstyledButton
              style={{ paddingBlockStart: 6 }}
              onClick={onBackClick}
            >
              <IconArrowLeft />
            </UnstyledButton>
          ) : (
            <Flex gap="xs" align="center">
              <LogoIcon />
              <Title order={3} c={"eco-green"}>
                Groot
              </Title>
            </Flex>
          )}
        </Flex>

        {/* 중앙 영역 - 페이지 타이틀 */}
        {title && (
          <Flex
            flex={1}
            justify={"center"}
            style={{
              paddingInlineStart: DYNAMIC_PADDING,
            }}
          >
            <Title order={4}>{title}</Title>
          </Flex>
        )}

        {/* 오른쪽 영역 */}
        <Flex align={"center"}>
          {isLogin && (
            <Avatar component="a" href={ROUTES.MY_PAGE}>
              {tempUser.name[0] || "U"}
            </Avatar>
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
        </Flex>
      </div>
    </AppShellHeader>
  );
};
