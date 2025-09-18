"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/ui/header";
import {
  useMissionHistories,
  useStampCollection,
} from "@/hooks/queries/useMissionSystem";
import { useCurrentUser } from "@/hooks/queries/useAuth";
import { useUpdateUserProfile } from "@/hooks/queries/useUser";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  Leaf,
  Loader2,
  PenSquare,
  ShieldCheck,
} from "lucide-react";
import { MissionHistorySummary, StampCollectionSummary } from "@/types";
import { useRouter } from "next/navigation";

interface ProfileFormState {
  nickname: string;
  birthYear: string;
  gender: "male" | "female" | "";
  address: string;
  profileImageUrl: string;
  primaryBadgeId: string;
  bio: string;
}

const DEFAULT_PROFILE: ProfileFormState = {
  nickname: "그루트",
  birthYear: "1995",
  gender: "",
  address: "경상북도 문경시",
  profileImageUrl:
    "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=400&q=80",
  primaryBadgeId: "",
  bio: "지속 가능한 여행을 꿈꾸는 친환경 실천가",
};

export default function MyPage() {
  const { data: currentUser } = useCurrentUser();
  const stampQuery = useStampCollection();
  const missionHistoryQuery = useMissionHistories();
  const updateProfile = useUpdateUserProfile();

  const [formState, setFormState] = useState<ProfileFormState>(DEFAULT_PROFILE);
  const [feedback, setFeedback] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!currentUser) return;

    setFormState((prev) => ({
      ...prev,
      nickname: currentUser.nickname ?? prev.nickname,
      birthYear: currentUser.birthYear
        ? String(currentUser.birthYear)
        : prev.birthYear,
      gender: currentUser.gender ?? "",
      address: currentUser.address ?? prev.address,
      profileImageUrl: currentUser.profileImageUrl ?? prev.profileImageUrl,
      primaryBadgeId: "",
    }));
  }, [currentUser]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    updateProfile.mutate(
      {
        nickname: formState.nickname,
        birthYear: Number(formState.birthYear) || new Date().getFullYear(),
        gender: (formState.gender || "female") as "male" | "female",
        address: formState.address,
        profileImageUrl: formState.profileImageUrl,
        primaryBadgeId: formState.primaryBadgeId
          ? Number(formState.primaryBadgeId)
          : undefined,
      },
      {
        onSuccess: () => {
          setFeedback("프로필이 업데이트되었습니다.");
        },
        onError: () => setFeedback("프로필 업데이트에 실패했습니다."),
      }
    );
  };

  const stampSummary = stampQuery.data ?? defaultStampSummary();
  const recentHistories = useMemo<MissionHistorySummary[]>(() => {
    const source = missionHistoryQuery.data ?? [];
    return source.slice(0, 3);
  }, [missionHistoryQuery.data]);

  return (
    <div className="space-y-6 pb-10">
      <AppHeader
        showBackButton
        title="마이 페이지"
        onBackClick={() => router.back()}
      />
      <p className="text-sm text-muted-foreground">
        나의 친환경 활동과 수집한 스탬프를 확인할 수 있어요.
      </p>

      <div className="grid gap-6 ">
        <section className="space-y-4">
          <Card>
            <CardHeader className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="text-xl">프로필 설정</CardTitle>
                <CardDescription>
                  개인정보와 대표 이미지를 수정하고 나만의 문구를 남겨보세요.
                </CardDescription>
              </div>
              <PenSquare className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="닉네임">
                    <Input
                      name="nickname"
                      value={formState.nickname}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                  <Field label="출생년도">
                    <Input
                      name="birthYear"
                      value={formState.birthYear}
                      onChange={handleChange}
                      inputMode="numeric"
                    />
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="성별">
                    <Select
                      value={formState.gender}
                      onValueChange={(value) =>
                        setFormState((prev) => ({
                          ...prev,
                          gender: value as "male" | "female" | "",
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">선택 없음</SelectItem>
                        <SelectItem value="female">여성</SelectItem>
                        <SelectItem value="male">남성</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="대표 배지 ID (선택)">
                    <Input
                      name="primaryBadgeId"
                      value={formState.primaryBadgeId}
                      onChange={handleChange}
                      placeholder="예: 5"
                      inputMode="numeric"
                    />
                  </Field>
                </div>

                <Field label="거주 지역">
                  <Input
                    name="address"
                    value={formState.address}
                    onChange={handleChange}
                    placeholder="예: 경상북도 문경시"
                  />
                </Field>

                <Field label="프로필 이미지 URL">
                  <Input
                    name="profileImageUrl"
                    value={formState.profileImageUrl}
                    onChange={handleChange}
                    placeholder="https://"
                  />
                </Field>

                <Field label="자기 소개 (선택)">
                  <Textarea
                    name="bio"
                    value={formState.bio}
                    onChange={handleChange}
                    rows={3}
                    placeholder="친환경 여행을 위한 다짐을 남겨보세요."
                  />
                </Field>

                <div className="flex items-center gap-3">
                  <Button
                    type="submit"
                    className="flex items-center gap-2"
                    disabled={updateProfile.isPending}
                  >
                    {updateProfile.isPending && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    변경사항 저장
                  </Button>
                  {feedback && (
                    <span className="text-sm text-muted-foreground">
                      {feedback}
                    </span>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>스탬프 컬렉션</CardTitle>
              <CardDescription>
                방문 인증으로 모은 스탬프와 지역별 달성률을 확인하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <StatTile
                  icon={<Leaf className="h-5 w-5" />}
                  label="수집한 스탬프"
                  value={`${stampSummary.statistics.totalStamps}개`}
                />
                <StatTile
                  icon={<ShieldCheck className="h-5 w-5" />}
                  label="지역 달성률"
                  value={`${stampSummary.statistics.areaCompletionRate.toFixed(
                    0
                  )}%`}
                />
                <StatTile
                  icon={<CalendarDays className="h-5 w-5" />}
                  label="완료된 지역"
                  value={`${stampSummary.statistics.completedAreas.length}곳`}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {stampSummary.stamps.map((stamp) => (
                  <div
                    key={stamp.id}
                    className="flex items-center gap-3 rounded-md border bg-muted/30 p-3"
                  >
                    <div
                      className="h-12 w-12 rounded-full border bg-cover bg-center"
                      style={{ backgroundImage: `url(${stamp.stampImageUrl})` }}
                    />
                    <div className="flex-1 text-sm">
                      <p className="font-semibold text-gray-900">
                        {stamp.course.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stamp.course.areaName} · {stamp.course.sigunguName}
                      </p>
                      <p className="text-xs text-muted-foreground/80">
                        {new Date(stamp.visitedAt).toLocaleDateString()} 방문
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>최근 미션 인증</CardTitle>
              <CardDescription>
                최신 3개의 인증 기록을 확인합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {missionHistoryQuery.isLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> 불러오는 중...
                </div>
              ) : recentHistories.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  아직 인증한 미션이 없습니다. 미션 페이지에서 첫 인증을
                  시작해보세요.
                </p>
              ) : (
                recentHistories.map((history) => (
                  <div
                    key={history.id}
                    className="rounded-md border bg-muted/20 p-3 text-sm"
                  >
                    <p className="font-semibold text-gray-900">
                      {history.mission.icon} {history.mission.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(history.createdAt).toLocaleString()} · 보상{" "}
                      {history.rewardCarbonEmission.toFixed(1)}kg CO₂e
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>계정 요약</CardTitle>
              <CardDescription>
                내 정보 요약과 프로필 이미지를 확인하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <div
                  className="h-16 w-16 rounded-full border bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${formState.profileImageUrl})`,
                  }}
                />
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {formState.nickname}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formState.address || "주소 미등록"}
                  </p>
                </div>
              </div>
              <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
                <p>생년: {formState.birthYear}</p>
                <p>
                  성별:{" "}
                  {formState.gender
                    ? formState.gender === "female"
                      ? "여성"
                      : "남성"
                    : "비공개"}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">{formState.bio}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>빠른 링크</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <QuickLink href="/mission" label="미션 인증 페이지" />
              <QuickLink href="/missions" label="친환경 미션 피드" />
              <QuickLink href="/eco-tourism-courses" label="생태관광 코스" />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
      {label}
      {children}
    </label>
  );
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-md border bg-muted/20 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <span className="text-lg font-semibold text-gray-900">{value}</span>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild variant="ghost" className="w-full justify-start">
      <Link href={href}>{label}</Link>
    </Button>
  );
}

function defaultStampSummary(): StampCollectionSummary {
  return {
    stamps: [],
    statistics: {
      totalStamps: 0,
      areaCompletionRate: 0,
      completedAreas: [],
    },
  };
}
