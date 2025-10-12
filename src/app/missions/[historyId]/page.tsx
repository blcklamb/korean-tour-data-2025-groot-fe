"use client";

import { AppHeader } from "@/components/ui/header";
import {
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
import { Loader2, ThumbsUp } from "lucide-react";
import {
  MissionBadgeReward,
  MissionFeedItem,
  MissionHistoryDetail,
} from "@/types";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

type MissionHistoryDetailPageProps = {
  params: {
    historyId: string;
  };
};

export default function MissionHistoryDetailPage({
  params,
}: MissionHistoryDetailPageProps) {
  const router = useRouter();
  const historyId = Number(params.historyId);
  const isValidId = Number.isInteger(historyId) && historyId > 0;

  const detailQuery = useMissionHistoryDetail(isValidId ? historyId : null);
  const likeMutation = useMissionHistoryLike();
  const isLiking =
    likeMutation.isPending && likeMutation.variables?.historyId === historyId;

  const handleLike = () => {
    if (!isValidId) {
      return;
    }

    likeMutation.mutate({ historyId });
  };

  const renderContent = () => {
    if (!isValidId) {
      return (
        <div className="rounded-md border border-dashed bg-muted/20 p-6 text-sm text-muted-foreground">
          잘못된 인증 기록입니다. 주소를 확인해주세요.
        </div>
      );
    }

    if (detailQuery.isLoading) {
      return (
        <div className="flex min-h-[240px] items-center justify-center rounded-md border border-dashed bg-muted/20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (detailQuery.isError || !detailQuery.data) {
      return (
        <div className="rounded-md border border-dashed bg-muted/20 p-6 text-sm text-muted-foreground">
          인증 상세 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <MissionHistoryDetailCard
          detail={detailQuery.data}
          onLike={handleLike}
          isLiking={isLiking}
        />
        <RelatedMissionsCard
          sameMissions={detailQuery.data.sameMissions ?? []}
          nearByMissions={detailQuery.data.nearByMissions ?? []}
        />
        <RewardBadgeCard badges={detailQuery.data.history.rewardBadge ?? []} />
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-10">
      <AppHeader
        showBackButton
        title="인증 상세"
        onBackClick={() => router.back()}
      />
      {renderContent()}
    </div>
  );
}

function MissionHistoryDetailCard({
  detail,
  onLike,
  isLiking,
}: {
  detail: MissionHistoryDetail;
  onLike: () => void;
  isLiking: boolean;
}) {
  const likeLabel = detail.history.isLiked ? "좋아요 취소" : "좋아요";
  const createdAt = new Date(detail.history.createdAt).toLocaleString();
  const locationInfo = detail.history.sigungu;
  const badges = detail.history.rewardBadge;

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xl font-semibold text-gray-900">
              {detail.history.user.nickname}
            </p>
            {locationInfo && (
              <p className="text-xs text-muted-foreground">
                {locationInfo.sigunguName}
              </p>
            )}
          </div>
        </div>
        <Separator />

        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">
            {detail.history.mission.icon} {detail.history.mission.name}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            #{detail.history.mission.tag} · {createdAt}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 text-sm">
        <section className="rounded-md bg-muted p-4">
          <p className="font-semibold text-gray-900">활동 내용</p>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            {detail.history.content}
          </p>
        </section>

        {detail.history.imageUrls?.length ? (
          <section className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">
              첨부 이미지
            </p>
            <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
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
          </section>
        ) : null}
        <section className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">
            획득한 배지
          </p>
          {badges?.length ? (
            <div className="grid gap-3 md:grid-cols-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-3 rounded-md border bg-muted/20 p-1"
                >
                  <div
                    className="h-10 w-10 flex-shrink-0 rounded-full border bg-muted bg-cover bg-center"
                    style={
                      badge.iconUrl
                        ? { backgroundImage: `url(${badge.iconUrl})` }
                        : undefined
                    }
                  />
                  <div className="flex-1 text-sm">
                    <p className="font-semibold text-gray-900">{badge.name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              아직 획득한 배지가 없습니다.
            </p>
          )}
        </section>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onLike}
            disabled={isLiking}
            className={
              detail.history.isLiked
                ? "bg-emerald-600 hover:bg-emerald-700"
                : undefined
            }
          >
            {isLiking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ThumbsUp className="h-4 w-4" />
            )}
            <span className="ml-2">{likeLabel}</span>
          </Button>
          <span className="text-xs text-muted-foreground">
            좋아요 수 {detail.history.likeCount}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function RelatedMissionsCard({
  sameMissions,
  nearByMissions,
}: {
  sameMissions: MissionFeedItem[];
  nearByMissions: MissionFeedItem[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>관련된 인증 살펴보기</CardTitle>
        <CardDescription>
          비슷한 미션이나 가까운 지역에서 진행된 인증을 참고해보세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {sameMissions.length ? (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground">
              같은 미션 인증
            </p>
            <SimilarList items={sameMissions} />
          </div>
        ) : (
          <div className="rounded-md border border-dashed bg-muted/20 p-4 text-xs text-muted-foreground">
            같은 미션으로 등록된 다른 인증이 아직 없습니다.
          </div>
        )}
        {nearByMissions.length ? (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground">
              가까운 지역 인증
            </p>
            <SimilarList items={nearByMissions} />
          </div>
        ) : (
          <div className="rounded-md border border-dashed bg-muted/20 p-4 text-xs text-muted-foreground">
            가까운 지역에서 진행된 인증이 아직 없습니다.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RewardBadgeCard({ badges }: { badges: MissionBadgeReward[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>획득한 배지</CardTitle>
        <CardDescription>
          미션 인증으로 획득한 배지를 확인해보세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {badges.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-3 rounded-md border bg-muted/20 p-3"
              >
                <div
                  className="h-12 w-12 flex-shrink-0 rounded-full border bg-muted bg-cover bg-center"
                  style={
                    badge.iconUrl
                      ? { backgroundImage: `url(${badge.iconUrl})` }
                      : undefined
                  }
                />
                <div className="flex-1 text-sm">
                  <p className="font-semibold text-gray-900">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">
                    배지 ID: {badge.id}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            아직 획득한 배지가 없습니다.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function SimilarList({ items }: { items: MissionFeedItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={`${item.id}-${item.user.userId}`}
          className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-muted/20 px-3 py-3 text-xs"
        >
          <div>
            <p className="font-medium text-gray-900">
              {item.mission.icon} {item.mission.name}
            </p>
            <p className="text-[11px] text-muted-foreground">
              #{item.mission.tag} · {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="text-right text-[11px] text-muted-foreground">
            <p>좋아요 {item.likeCount}</p>
            <p>작성자 {item.user.nickname}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
