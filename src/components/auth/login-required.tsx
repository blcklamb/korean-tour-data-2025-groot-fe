"use client";

import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLoginRedirect } from "@/hooks/useLoginRedirect";
import { cn } from "@/lib/utils";

interface LoginRequiredProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  className?: string;
  redirectTo?: string | null;
  onAction?: () => void;
}

export function LoginRequired({
  title = "로그인이 필요한 서비스입니다",
  description = "로그인 후 이용하실 수 있어요.",
  actionLabel = "로그인하러 가기",
  className,
  redirectTo,
  onAction,
}: LoginRequiredProps) {
  const { goToLogin } = useLoginRedirect({ redirectTo });

  const handleClick = () => {
    onAction?.();
    goToLogin();
  };

  return (
    <Card className={cn("text-center flex flex-col items-center", className)}>
      <CardHeader className="space-y-3">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <LogIn className="h-5 w-5" />
        </div>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription className="whitespace-pre-line">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <Button className="w-full" onClick={handleClick} size="lg">
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
