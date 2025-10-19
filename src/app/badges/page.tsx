"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAllBadges, useUserBadges } from "@/hooks/queries/useUser";
import { useCurrentUser } from "@/hooks/queries/useAuth";
import type { Badge } from "@/types";
import Image from "next/image";
import { AppHeader } from "@/components/ui/header";
import LogoIcon from "@/components/ui/logo";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type DisplayBadge = Badge & {
  unlocked: boolean;
  unlockedAt?: string;
  isPrimary?: boolean;
};

const formatUnlockedDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "--";
  }
  return parsed.toISOString().split("T")[0];
};

export default function BadgesPage() {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const {
    data: allBadges,
    isLoading: isAllBadgesLoading,
    isError: isAllBadgesError,
    refetch: refetchAllBadges,
  } = useAllBadges();

  const userId = currentUser?.id ?? "";
  const {
    data: userBadges,
    isLoading: isUserBadgesLoading,
    isError: isUserBadgesError,
    refetch: refetchUserBadges,
  } = useUserBadges(userId);

  const primaryBadgeId = useMemo(() => {
    if (!userBadges?.primaryBadgeId) return null;
    return String(userBadges.primaryBadgeId);
  }, [userBadges?.primaryBadgeId]);

  const mergedBadges = useMemo<DisplayBadge[]>(() => {
    if (!allBadges) return [];
    const ownedBadgeMap = new Map<string, string>();

    userBadges?.ownedBadges.forEach((ownedBadge) => {
      ownedBadgeMap.set(String(ownedBadge.badgeId), ownedBadge.createdAt);
    });

    return allBadges.map((badge) => {
      const badgeId = String(badge.id);
      const unlockedAt = ownedBadgeMap.get(badgeId);
      return {
        ...badge,
        unlocked: Boolean(unlockedAt),
        unlockedAt,
        isPrimary: primaryBadgeId === badgeId,
      };
    });
  }, [allBadges, userBadges, primaryBadgeId]);

  const sortedBadges = useMemo<DisplayBadge[]>(() => {
    const getUnlockedTime = (badge: DisplayBadge) => {
      if (!badge.unlockedAt) return 0;
      const timestamp = new Date(badge.unlockedAt).getTime();
      return Number.isFinite(timestamp) ? timestamp : 0;
    };

    return [...mergedBadges].sort((a, b) => {
      if (a.isPrimary !== b.isPrimary) {
        return Number(b.isPrimary) - Number(a.isPrimary);
      }

      if (a.unlocked !== b.unlocked) {
        return Number(b.unlocked) - Number(a.unlocked);
      }

      if (a.unlocked && b.unlocked) {
        return getUnlockedTime(b) - getUnlockedTime(a);
      }

      return a.name.localeCompare(b.name, "ko");
    });
  }, [mergedBadges]);

  const [selectedBadge, setSelectedBadge] = useState<DisplayBadge | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleBadgeClick = useCallback((badge: DisplayBadge) => {
    if (!badge.unlocked) return;
    setSelectedBadge(badge);
    setIsDialogOpen(true);
  }, []);

  const handleDialogOpenChange = useCallback((open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedBadge(null);
    }
  }, []);

  const isBadgesLoading = isAllBadgesLoading || isUserBadgesLoading;
  const isBadgesError = isAllBadgesError || isUserBadgesError;

  const handleRetry = useCallback(() => {
    if (isAllBadgesError) {
      void refetchAllBadges();
    }
    if (isUserBadgesError) {
      void refetchUserBadges();
    }
  }, [
    isAllBadgesError,
    isUserBadgesError,
    refetchAllBadges,
    refetchUserBadges,
  ]);

  const unlockedCount = sortedBadges.filter((badge) => badge.unlocked).length;
  const totalCount = sortedBadges.length;
  const progressValue =
    totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <AppHeader
        title="뱃지 수집 현황"
        showBackButton
        onBackClick={() => router.back()}
      />

      <main className="space-y-6 px-4 py-6">
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>획득한 뱃지</span>
            <span className="font-medium text-slate-900">
              {unlockedCount}/{totalCount || "--"}
            </span>
          </div>
          <Progress
            value={progressValue}
            className="mt-3 h-2 rounded-full bg-slate-200 [&>div]:rounded-full [&>div]:bg-slate-900"
          />
        </section>
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          {isBadgesError ? (
            <div className="space-y-3 text-center">
              <p className="text-sm text-destructive">
                뱃지를 불러오지 못했습니다.
              </p>
              <Button size="sm" variant="outline" onClick={handleRetry}>
                다시 시도
              </Button>
            </div>
          ) : isBadgesLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-100/60"
                >
                  <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                </div>
              ))}
            </div>
          ) : sortedBadges.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {sortedBadges.map((badge) => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  onClick={handleBadgeClick}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-100/60 text-sm text-slate-500">
              아직 등록된 뱃지가 없습니다.
            </div>
          )}
        </section>
      </main>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-sm rounded-3xl border-none px-6 py-8 text-center shadow-xl">
          {selectedBadge && (
            <div className="flex flex-col items-center gap-6">
              {selectedBadge.iconUrl ? (
                <Image
                  src={selectedBadge.iconUrl}
                  alt={selectedBadge.name}
                  width={72}
                  height={72}
                  className="h-16 w-16 object-contain"
                />
              ) : (
                <LogoIcon className="h-16 w-16" />
              )}
              <div className="flex w-full flex-col items-center gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {selectedBadge.name}
                  </h2>
                </div>
                <dl className="w-full space-y-4 text-left text-sm text-slate-600">
                  <div>
                    <dt className="font-semibold text-slate-900">뱃지 설명</dt>
                    <dd className="mt-1 whitespace-pre-line">
                      {selectedBadge.description}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-900">획득 조건</dt>
                    <dd className="mt-1 whitespace-pre-line">
                      {selectedBadge.criteria}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-900">획득일자</dt>
                    <dd className="mt-1 text-slate-900">
                      {selectedBadge.unlockedAt
                        ? formatUnlockedDate(selectedBadge.unlockedAt)
                        : "--"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BadgeCard({
  badge,
  onClick,
}: {
  badge: DisplayBadge;
  onClick?: (badge: DisplayBadge) => void;
}) {
  const isUnlocked = badge.unlocked;
  const handleClick = useCallback(() => {
    if (!isUnlocked || !onClick) return;
    onClick(badge);
  }, [badge, isUnlocked, onClick]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isUnlocked}
      className={`flex w-full flex-col items-center justify-between rounded-2xl border p-4 text-center shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 disabled:cursor-default disabled:pointer-events-none disabled:opacity-100 ${
        isUnlocked
          ? "border-emerald-200 bg-white hover:border-emerald-300 hover:shadow-md"
          : "border-transparent bg-slate-100/60 text-slate-400"
      }`}
    >
      {badge.iconUrl ? (
        <Image
          src={badge.iconUrl}
          alt={badge.name}
          width={48}
          height={48}
          className={`h-12 w-12 object-contain ${
            isUnlocked ? "" : "opacity-60"
          }`}
        />
      ) : (
        <LogoIcon className={`h-12 w-12 ${isUnlocked ? "" : "opacity-60"}`} />
      )}
      <span
        className={`mt-2 text-sm font-semibold ${
          isUnlocked ? "text-slate-900" : "text-slate-400"
        }`}
      >
        {badge.name}
      </span>
      <p
        className={`text-xs  ${
          isUnlocked ? "text-slate-500" : "text-slate-400"
        }`}
      >
        {badge.criteria}
      </p>
      {isUnlocked ? (
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
            badge.isPrimary
              ? "bg-slate-900 text-white"
              : "border border-slate-200 bg-white text-slate-700"
          }`}
        >
          {badge.isPrimary ? "대표" : "대표 설정"}
        </span>
      ) : (
        <span className="h-5" />
      )}
    </button>
  );
}
