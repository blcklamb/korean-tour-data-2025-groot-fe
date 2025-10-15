"use client";

import { useMemo, useState } from "react";
import { AppHeader } from "@/components/ui/header";
import { useMissionList } from "@/hooks/queries/useMissionSystem";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Loader2, MapPin, Tag } from "lucide-react";
import { MissionListItem } from "@/types";
import { useRouter } from "next/navigation";
import { MissionSubmitDialog } from "./_components/mission-submit-dialog";

function getUniqueTags(missions: MissionListItem[]): string[] {
  const tags = new Set<string>();
  missions.forEach((mission) => {
    if (mission.tag) {
      tags.add(mission.tag);
    }
  });
  return Array.from(tags);
}

export default function MissionPage() {
  const router = useRouter();
  const [selectedTag, setSelectedTag] = useState<string | undefined>();

  const missionQuery = useMissionList(selectedTag);
  const missions = missionQuery.data || [];
  const tags = useMemo(() => getUniqueTags(missions), [missions]);

  return (
    <div className="space-y-6 pb-10">
      <AppHeader
        showBackButton
        title="친환경 미션 인증"
        onBackClick={() => router.back()}
      />
      <p className="text-sm text-muted-foreground">
        오늘 실천한 친환경 활동을 기록하고 탄소 절감을 인증해보세요.
      </p>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <TagPill
            active={!selectedTag}
            label="전체"
            onClick={() => setSelectedTag(undefined)}
          />
          {tags.map((tag) => (
            <TagPill
              key={tag}
              active={selectedTag === tag}
              label={`#${tag}`}
              onClick={() => setSelectedTag(tag)}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {missionQuery.isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center md:col-span-2">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          </div>
        ) : missions.length === 0 ? (
          <div className="rounded-md border border-dashed bg-muted/30 p-8 text-center text-muted-foreground md:col-span-2">
            표시할 미션이 없습니다. 다른 태그를 선택하거나 잠시 후 다시
            시도해주세요.
          </div>
        ) : (
          missions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))
        )}
      </section>
    </div>
  );
}

function MissionCard({ mission }: { mission: MissionListItem }) {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Tag className="h-4 w-4" />#{mission.tag}
          </span>
          <span className="flex items-center gap-1 text-emerald-700">
            <MapPin className="h-4 w-4" />
            {mission.rewardCarbonEmission.toFixed(1)}kg CO₂e
          </span>
        </div>
        <CardTitle className="text-xl font-semibold">
          {mission.icon} {mission.name}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {mission.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MissionSubmitDialog
          missionId={mission.id}
          missionTitle={mission.name}
        />
      </CardContent>
    </Card>
  );
}

function TagPill({
  label,
  onClick,
  active,
}: {
  label: string;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
        active
          ? "bg-emerald-600 text-white"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      {label}
    </button>
  );
}
