"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/ui/header";
import {
  useMissionCompletion,
  useMissionList,
} from "@/hooks/queries/useMissionSystem";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MapPin, Tag, Upload } from "lucide-react";
import { MissionListItem, MissionCompletionResult } from "@/types";
import { useRouter } from "next/navigation";

function getUniqueTags(missions: MissionListItem[]): string[] {
  const tags = new Set<string>();
  missions.forEach((mission) => {
    if (mission.tag) {
      tags.add(mission.tag);
    }
  });
  return Array.from(tags);
}

interface MissionFormState {
  content: string;
  latitude: string;
  longitude: string;
  sigunguId: string;
  files: File[];
}

const INITIAL_FORM_STATE: MissionFormState = {
  content: "",
  latitude: "",
  longitude: "",
  sigunguId: "",
  files: [],
};

export default function MissionPage() {
  const router = useRouter();
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const [activeMissionId, setActiveMissionId] = useState<number | null>(null);
  const [formState, setFormState] =
    useState<MissionFormState>(INITIAL_FORM_STATE);

  const [submissionResult, setSubmissionResult] =
    useState<MissionCompletionResult | null>(null);

  const missionQuery = useMissionList(selectedTag);
  const missions = missionQuery.data ?? [];
  const tags = useMemo(() => getUniqueTags(missions), [missions]);

  const completionMutation = useMissionCompletion({
    onSuccess: (result) => {
      setSubmissionResult(result);
      setFormState(INITIAL_FORM_STATE);
      setActiveMissionId(null);
    },
  });

  const handleSelectMission = (missionId: number) => {
    setActiveMissionId((prev) => (prev === missionId ? null : missionId));
    setSubmissionResult(null);
  };

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = event.target as HTMLInputElement;

    if (name === "images" && files) {
      setFormState((prev) => ({
        ...prev,
        files: Array.from(files).slice(0, 3),
      }));
      return;
    }

    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionResult(null);

    if (!activeMissionId) return;

    const formData = new FormData();
    formData.append("content", formState.content);

    if (formState.latitude) formData.append("latitude", formState.latitude);
    if (formState.longitude) formData.append("longitude", formState.longitude);
    if (formState.sigunguId) formData.append("sigunguId", formState.sigunguId);

    formState.files.forEach((file) => {
      formData.append("images", file);
    });

    completionMutation.mutate({ missionId: activeMissionId, formData });
  };

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
            <MissionCard
              key={mission.id}
              mission={mission}
              isActive={activeMissionId === mission.id}
              onSelect={() => handleSelectMission(mission.id)}
            />
          ))
        )}
      </section>

      {activeMissionId && (
        <section className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>미션 인증하기</CardTitle>
              <CardDescription>
                활동 내용을 간단히 작성하고 사진을 첨부하면 미션 인증이
                완료됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="content"
                  >
                    활동 내용
                  </label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formState.content}
                    onChange={handleFormChange}
                    placeholder="오늘 실천한 친환경 활동을 기록해보세요."
                    minLength={5}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium text-gray-700"
                      htmlFor="latitude"
                    >
                      위도
                    </label>
                    <Input
                      id="latitude"
                      name="latitude"
                      value={formState.latitude}
                      onChange={handleFormChange}
                      placeholder="예: 37.5665"
                      inputMode="decimal"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium text-gray-700"
                      htmlFor="longitude"
                    >
                      경도
                    </label>
                    <Input
                      id="longitude"
                      name="longitude"
                      value={formState.longitude}
                      onChange={handleFormChange}
                      placeholder="예: 126.9780"
                      inputMode="decimal"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium text-gray-700"
                      htmlFor="sigunguId"
                    >
                      방문 시군구 ID (선택)
                    </label>
                    <Input
                      id="sigunguId"
                      name="sigunguId"
                      value={formState.sigunguId}
                      onChange={handleFormChange}
                      placeholder="예: 1"
                      inputMode="numeric"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="images"
                  >
                    인증 사진 업로드 (최대 3장)
                  </label>
                  <Input
                    id="images"
                    name="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFormChange}
                  />
                  {formState.files.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {formState.files.length}개의 사진이 선택되었습니다.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    type="submit"
                    disabled={completionMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    {completionMutation.isPending && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    미션 인증 올리기
                  </Button>
                  <Link
                    href="/missions"
                    className="text-sm text-emerald-700 hover:underline"
                  >
                    다른 사용자 인증 보러 가기 →
                  </Link>
                </div>
              </form>

              {submissionResult && (
                <div className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                  미션 인증이 완료되었습니다! 보상 탄소 절감량:{" "}
                  <strong>
                    {submissionResult.rewardCarbonEmission.toFixed(1)}kg CO₂e
                  </strong>
                  {submissionResult.rewardBadge && (
                    <span>
                      {" "}
                      · 획득 배지: {submissionResult.rewardBadge.name}
                    </span>
                  )}
                </div>
              )}

              {completionMutation.isError && (
                <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  미션 인증 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}

function MissionCard({
  mission,
  isActive,
  onSelect,
}: {
  mission: MissionListItem;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <Card className={isActive ? "border-emerald-500 shadow-lg" : undefined}>
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
        <Button
          variant={isActive ? "default" : "secondary"}
          className="w-full flex items-center gap-2"
          onClick={onSelect}
        >
          <Upload className="h-4 w-4" />
          {isActive ? "인증 폼 닫기" : "미션 인증하기"}
        </Button>
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
