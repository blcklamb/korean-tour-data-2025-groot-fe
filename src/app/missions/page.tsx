"use client";
import { AppHeader } from "@/components/ui/header";
import {
  useMissionFeed,
  useMissionHistoryLike,
} from "@/hooks/queries/useMissionSystem";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircle, ThumbsUp, UserRound } from "lucide-react";
import { MissionFeedItem } from "@/types";
import { useRouter } from "next/navigation";
import { getRouteLabel, ROUTES } from "@/lib/routes";

export default function MissionsFeedPage() {
  const router = useRouter();
  const feedQuery = useMissionFeed();
  const likeMutation = useMissionHistoryLike();
  const pendingHistoryId = likeMutation.variables?.historyId;

  const handleSelectHistory = (historyId: number) => {
    router.push(`/missions/${historyId}`);
  };

  const handleLike = (historyId: number) => {
    likeMutation.mutate({ historyId });
  };

  return (
    <div className="space-y-6 pb-10">
      <AppHeader
        showBackButton
        title={getRouteLabel(ROUTES.MISSIONS)}
        onBackClick={() => router.back()}
      />
      <p className="text-sm text-muted-foreground">
        다른 사용자들의 친환경 미션 인증을 살펴보고 공감해보세요.
      </p>

      <section className="space-y-4">
        <SectionTitle
          label="실시간 미션 피드"
          description="전국 사용자들의 최신 인증 기록"
        />
        {feedQuery.isLoading ? (
          <EmptyState message="피드를 불러오는 중입니다..." isLoading />
        ) : (feedQuery.data?.length ?? 0) === 0 ? (
          <EmptyState message="아직 인증된 미션이 없습니다." />
        ) : (
          <div className="grid gap-4">
            {feedQuery.data?.map((item) => (
              <MissionFeedCard
                key={item.id}
                data={item}
                onLike={() => handleLike(item.id)}
                onSelect={() => handleSelectHistory(item.id)}
                isLoading={
                  likeMutation.isPending && pendingHistoryId === item.id
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SectionTitle({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900">{label}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function EmptyState({
  message,
  isLoading,
}: {
  message: string;
  isLoading?: boolean;
}) {
  return (
    <div className="flex min-h-[160px] flex-col items-center justify-center rounded-md border border-dashed bg-muted/30 p-6 text-sm text-muted-foreground">
      {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : message}
      {!isLoading && (
        <p className="mt-2 text-xs text-muted-foreground/80">
          친환경 활동 인증을 올려보세요!
        </p>
      )}
    </div>
  );
}

function MissionFeedCard({
  data,
  onLike,
  onSelect,
  isLoading,
}: {
  data: MissionFeedItem;
  onLike: () => void;
  onSelect: () => void;
  isLoading: boolean;
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <UserRound className="h-4 w-4" />
            {data.user.nickname}
          </span>
          <span>#{data.mission.tag}</span>
        </div>
        <CardTitle className="text-lg font-semibold">
          {data.mission.icon} {data.mission.name}
        </CardTitle>
        {data.rewardBadge && (
          <CardDescription className="text-xs text-emerald-700">
            획득 배지: {data.rewardBadge.name}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{new Date(data.createdAt).toLocaleString()}</span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            공감 {data.likeCount}
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={onSelect}>
            상세 보기
          </Button>
          <Button
            size="sm"
            onClick={onLike}
            disabled={isLoading}
            className={
              data.isLiked ? "bg-emerald-600 hover:bg-emerald-700" : undefined
            }
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ThumbsUp className="h-4 w-4" />
            )}
            <span className="ml-1">좋아요</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
