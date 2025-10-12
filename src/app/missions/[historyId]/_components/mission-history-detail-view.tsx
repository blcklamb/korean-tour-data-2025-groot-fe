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
import { MissionFeedItem, MissionHistoryDetail } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { formatRelativeDate } from "@/lib/date";

type MissionHistoryDetailViewProps = {
  historyIdParam: string;
};

export default function MissionHistoryDetailView({
  historyIdParam,
}: MissionHistoryDetailViewProps) {
  const router = useRouter();
  const historyId = Number(historyIdParam);
  const isValidId = Number.isInteger(historyId) && historyId > 0;

  const detailQuery = useMissionHistoryDetail(isValidId ? historyId : null);
  const likeMutation = useMissionHistoryLike();
  const isLiking =
    likeMutation.isPending && likeMutation.variables?.historyId === historyId;

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
      <MissionHistoryDetailContent
        detail={detailQuery.data}
        onLike={() => likeMutation.mutate({ historyId })}
        isLiking={isLiking}
      />
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

function MissionHistoryDetailContent({
  detail,
  onLike,
  isLiking,
}: {
  detail: MissionHistoryDetail;
  onLike: () => void;
  isLiking: boolean;
}) {
  const likeLabel = detail.history.isLiked ? "좋아요 취소" : "좋아요";
  const createdAt = formatRelativeDate(detail.history.createdAt);
  const locationInfo = detail.history.sigungu;
  const badges = detail.history.rewardBadge;

  return (
    <div className="space-y-6">
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
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onLike}
                disabled={isLiking}
                aria-label="좋아요 토글"
              >
                {isLiking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ThumbsUp
                    className={`h-4 w-4 ${
                      detail.history.isLiked ? "text-emerald-500" : ""
                    }`}
                  />
                )}
              </Button>
              <span className="text-xs text-muted-foreground self-center">
                좋아요 수 {detail.history.likeCount}
              </span>
            </div>
          </div>
          <Separator />
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">
              {detail.history.mission.icon} {detail.history.mission.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <MissionTagBadge tag={detail.history.mission.tag} />
              <CardDescription className="text-xs text-muted-foreground">
                {createdAt}
              </CardDescription>
            </div>
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
                      <p className="font-semibold text-gray-900">
                        {badge.name}
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

      <RelatedMissionsCard
        sameMissions={detail.sameMissions ?? []}
        nearByMissions={detail.nearByMissions ?? []}
      />
    </div>
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

function SimilarList({ items }: { items: MissionFeedItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Link
          key={`${item.id}-${item.user.userId}`}
          href={`/missions/${item.id}`}
          className="group block"
        >
          <div className="flex flex-wrap items-start justify-between gap-3 rounded-md border bg-muted/20 px-3 py-3 text-xs transition hover:border-emerald-300 hover:bg-emerald-50/50">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900">
                {item.mission.icon} {item.mission.name}
              </p>
              <p className="text-[11px] text-muted-foreground">
                #{item.mission.tag} · {formatRelativeDate(item.createdAt)}
              </p>
              {item.content ? (
                <p
                  className="mt-1 text-xs text-muted-foreground"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.content}
                </p>
              ) : null}
            </div>
            <div className="text-right text-[11px] text-muted-foreground">
              <p>좋아요 {item.likeCount}</p>
              <p>작성자 {item.user.nickname}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function MissionTagBadge({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
      #{tag}
    </span>
  );
}
