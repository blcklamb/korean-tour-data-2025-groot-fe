"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/ui/header";
import {
  useMissionHistories,
  useMissionHistoryLike,
} from "@/hooks/queries/useMissionSystem";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ThumbsUp } from "lucide-react";
import { MissionHistorySummary } from "@/types";
import { LoginRequired } from "@/components/auth/login-required";
import { tokenStorage } from "@/lib/api/auth";
import { formatRelativeDate } from "@/lib/date";

export default function MyMissionHistoriesPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    const syncAuthState = () => {
      setIsAuthenticated(tokenStorage.isAuthenticated());
    };

    syncAuthState();
    setHasCheckedAuth(true);

    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  const historyQuery = useMissionHistories({ enabled: isAuthenticated });
  const likeMutation = useMissionHistoryLike();
  const pendingHistoryId = likeMutation.variables?.historyId;
  const histories: MissionHistorySummary[] = historyQuery.data ?? [];

  const handleViewDetail = (historyId: number) => {
    router.push(`/missions/${historyId}`);
  };

  const handleLike = (historyId: number) => {
    likeMutation.mutate({ historyId });
  };

  if (!hasCheckedAuth) {
    return (
      <div className="space-y-6 pb-10">
        <AppHeader
          showBackButton
          title="나의 인증 모음"
          onBackClick={() => router.back()}
        />
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-6 pb-10">
        <AppHeader
          showBackButton
          title="나의 인증 모음"
          onBackClick={() => router.back()}
        />
        <LoginRequired
          className="mx-auto max-w-md"
          redirectTo="/my-page/histories"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <AppHeader
        showBackButton
        title="나의 인증 모음"
        onBackClick={() => router.back()}
      />
      <p className="text-sm text-muted-foreground">
        내가 인증한 친환경 미션 기록을 모두 확인할 수 있습니다.
      </p>

      <Card className="py-4">
        <CardContent className="space-y-4">
          {historyQuery.isLoading ? (
            <HistoryLoadingState />
          ) : historyQuery.isError ? (
            <HistoryErrorState />
          ) : histories.length === 0 ? (
            <EmptyHistoryState />
          ) : (
            histories.map((history) => (
              <HistoryCard
                key={history.id}
                data={history}
                onViewDetail={() => handleViewDetail(history.id)}
                onLike={() => handleLike(history.id)}
                isLiking={
                  likeMutation.isPending && pendingHistoryId === history.id
                }
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function HistoryCard({
  data,
  onViewDetail,
  onLike,
  isLiking,
}: {
  data: MissionHistorySummary;
  onViewDetail: () => void;
  onLike: () => void;
  isLiking: boolean;
}) {
  return (
    <Card className="border-muted">
      <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4 text-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-gray-900">
              {data.mission.icon} {data.mission.name}
            </span>
            <span>
              {formatRelativeDate(data.createdAt)} · 보상{" "}
              {data.rewardCarbonEmission.toFixed(1)}kg CO₂e
            </span>
          </div>
          {data.content && (
            <p className="text-sm text-muted-foreground/90">{data.content}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onViewDetail}>
            상세 보기
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLike}
            disabled={isLiking}
            className={
              data.isLiked
                ? "text-emerald-600 hover:text-emerald-600"
                : undefined
            }
          >
            {isLiking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ThumbsUp className="h-4 w-4" />
            )}
            <span className="ml-1 text-xs">공감 {data.likeCount}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function HistoryLoadingState() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> 기록을 불러오는 중입니다...
    </div>
  );
}

function HistoryErrorState() {
  return (
    <div className="rounded-md border border-dashed bg-muted/20 p-4 text-sm text-muted-foreground">
      인증 기록을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
    </div>
  );
}

function EmptyHistoryState() {
  return (
    <div className="rounded-md border border-dashed bg-muted/20 p-6 text-sm text-muted-foreground">
      아직 인증한 미션이 없습니다. 미션 페이지에서 첫 인증을 시작해보세요.
    </div>
  );
}
