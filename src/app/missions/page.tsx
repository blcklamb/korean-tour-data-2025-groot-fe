"use client";

import { useState } from "react";
import { AppHeader } from "@/components/ui/header";
import {
  useMissionFeed,
  useMissionHistories,
  useMissionHistoryDetail,
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
import {
  MissionFeedItem,
  MissionHistoryDetail,
  MissionHistorySummary,
} from "@/types";
import { useRouter } from "next/navigation";

export default function MissionsFeedPage() {
  const router = useRouter();
  const feedQuery = useMissionFeed();
  const historyQuery = useMissionHistories();
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(
    null
  );
  const likeMutation = useMissionHistoryLike();

  const detailQuery = useMissionHistoryDetail(selectedHistoryId);

  const handleSelectHistory = (historyId: number) => {
    setSelectedHistoryId((prev) => (prev === historyId ? null : historyId));
  };

  const handleLike = (historyId: number) => {
    likeMutation.mutate({ historyId });
  };

  const selectedDetail = detailQuery.data ?? null;

  return (
    <div className="space-y-6 pb-10">
      <AppHeader
        showBackButton
        title="친환경 미션 피드"
        onBackClick={() => router.back()}
      />
      <p className="text-sm text-muted-foreground">
        다른 사용자들의 친환경 미션 인증을 살펴보고 공감해보세요.
      </p>

      <div className="grid gap-6 ">
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
                  isLoading={likeMutation.isPending}
                  isActive={selectedHistoryId === item.id}
                />
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <SectionTitle
            label="나의 인증 모음"
            description="최근에 인증한 미션을 확인하세요"
          />
          {historyQuery.isLoading ? (
            <EmptyState message="기록을 불러오는 중입니다..." isLoading />
          ) : (historyQuery.data?.length ?? 0) === 0 ? (
            <EmptyState message="아직 인증한 미션이 없습니다." />
          ) : (
            <div className="space-y-3">
              {historyQuery.data?.map((history) => (
                <MiniHistoryCard
                  key={history.id}
                  data={history}
                  onSelect={() => handleSelectHistory(history.id)}
                  onLike={() => handleLike(history.id)}
                  isLoading={likeMutation.isPending}
                />
              ))}
            </div>
          )}

          <DetailPanel
            isLoading={detailQuery.isFetching}
            detail={selectedDetail}
          />
        </aside>
      </div>
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
  isActive,
}: {
  data: MissionFeedItem;
  onLike: () => void;
  onSelect: () => void;
  isLoading: boolean;
  isActive: boolean;
}) {
  return (
    <Card
      className={`transition-shadow ${
        isActive ? "border-emerald-500 shadow-lg" : "hover:shadow-md"
      }`}
    >
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

function MiniHistoryCard({
  data,
  onSelect,
  onLike,
  isLoading,
}: {
  data: MissionHistorySummary;
  onSelect: () => void;
  onLike: () => void;
  isLoading: boolean;
}) {
  return (
    <Card className="border-muted">
      <CardContent className="flex items-center justify-between gap-3 p-4 text-sm">
        <div>
          <p className="font-medium text-gray-900">
            {data.mission.icon} {data.mission.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(data.createdAt).toLocaleDateString()} · 보상{" "}
            {data.rewardCarbonEmission.toFixed(1)}kg CO₂e
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onSelect}>
            보기
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLike}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ThumbsUp
                className={`h-4 w-4 ${data.isLiked ? "text-emerald-600" : ""}`}
              />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DetailPanel({
  detail,
  isLoading,
}: {
  detail: MissionHistoryDetail | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <EmptyState message="상세 정보를 불러오는 중입니다..." isLoading />;
  }

  if (!detail) {
    return (
      <div className="rounded-md border border-dashed bg-muted/20 p-4 text-sm text-muted-foreground">
        상세히 보고 싶은 미션을 선택해보세요.
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg font-semibold">
          {detail.history.mission.icon} {detail.history.mission.name}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {new Date(detail.history.createdAt).toLocaleString()} ·{" "}
          {detail.history.mission.tag}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="rounded-md bg-muted p-3">
          <p className="font-medium text-gray-900">
            {detail.history.user.nickname}
          </p>
          <p className="mt-1 text-muted-foreground">{detail.history.content}</p>
        </div>

        {detail.history.imageUrls?.length ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">
              첨부 이미지
            </p>
            <div className="grid grid-cols-3 gap-2">
              {detail.history.imageUrls.map((url: string) => (
                <div
                  key={url}
                  className="aspect-video overflow-hidden rounded-md border bg-muted"
                  style={{
                    backgroundImage: `url(${url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              ))}
            </div>
          </div>
        ) : null}

        <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
          <p>공감 수: {detail.history.likeCount}</p>
          {detail.history.sigungu && (
            <p>
              위치: {detail.history.sigungu.sigunguName} (
              {detail.history.sigungu.mapY.toFixed(3)},
              {detail.history.sigungu.mapX.toFixed(3)})
            </p>
          )}
        </div>

        {detail.sameMissions?.length ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">
              같은 미션 인증
            </p>
            <SimilarList items={detail.sameMissions} />
          </div>
        ) : null}

        {detail.nearByMissions?.length ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">
              가까운 지역 인증
            </p>
            <SimilarList items={detail.nearByMissions} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function SimilarList({ items }: { items: MissionFeedItem[] }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={`${item.id}-${item.user.userId}`}
          className="flex items-center justify-between rounded-md border bg-muted/20 px-3 py-2 text-xs"
        >
          <span className="font-medium text-gray-900">
            {item.mission.icon} {item.mission.name}
          </span>
          <span className="text-muted-foreground">
            공감 {item.likeCount} ·{" "}
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  );
}
