"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEcoTourCourse, useToggleEcoTourCourseLike } from "@/hooks/queries";
import { Leaf, Loader2, MapPin, Phone, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { AppHeader } from "@/components/ui/header";
import { getRouteHref, ROUTES } from "@/lib/routes";

export default function EcoTourCourseDetailPage() {
  const params = useParams<{ courseId: string }>();
  const courseIdParam = Array.isArray(params?.courseId)
    ? params?.courseId[0]
    : params?.courseId;

  const router = useRouter();

  const {
    data: course,
    isLoading,
    isError,
    error,
  } = useEcoTourCourse(courseIdParam ?? "");

  const toggleLikeMutation = useToggleEcoTourCourseLike();

  const likeButtonLabel = useMemo(() => {
    if (!course) return "좋아요";
    return course.isLiked ? "좋아요 취소" : "좋아요";
  }, [course]);

  const handleToggleLike = () => {
    if (!course) return;
    toggleLikeMutation.mutate({ courseId: course.id });
  };

  if (!courseIdParam) {
    return (
      <div className="space-y-4">
        <Button asChild variant="outline">
          <Link href="/eco-tourism-courses">코스 목록으로 돌아가기</Link>
        </Button>
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          잘못된 코스 경로입니다.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-2 text-gray-600">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>코스 정보를 불러오는 중입니다...</span>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="space-y-4">
        <Button asChild variant="outline">
          <Link href="/eco-tourism-courses">코스 목록으로 돌아가기</Link>
        </Button>
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error?.message || "코스 정보를 불러오는 중 오류가 발생했습니다."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AppHeader
        showBackButton
        title={course.title}
        onBackClick={() =>
          router.push(getRouteHref(ROUTES.ECO_TOURISM_COURSES))
        }
      />
      <div className="space-y-4">
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="h-56 w-full bg-gray-100">
            {course.thumbnailUrl ? (
              <Image
                src={course.thumbnailUrl}
                alt={course.title}
                className="h-full w-full object-cover"
                width={500}
                height={300}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                이미지가 없습니다.
              </div>
            )}
          </div>
          <div className="space-y-4 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {course.areaName} · {course.sigunguName}
              </span>
              <span>조회수 {course.viewCount.toLocaleString()}회</span>
              <span>
                총 탄소 배출량 {course.totalCarbonEmission.toFixed(1)}kg CO₂e
              </span>
              <span>
                등록일 {new Date(course.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                {course.title}
              </h1>
              <div className="flex flex-col items-end gap-2">
                <Button
                  onClick={handleToggleLike}
                  disabled={toggleLikeMutation.isPending}
                  variant={course.isLiked ? "default" : "secondary"}
                >
                  {toggleLikeMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ThumbsUp className="mr-2 h-4 w-4" />
                  )}
                  {likeButtonLabel} ({course.likeCount.toLocaleString()})
                </Button>
                {toggleLikeMutation.isError && (
                  <p className="text-xs text-red-600">
                    좋아요 처리 중 오류가 발생했습니다. 다시 시도해주세요.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">코스 구성 장소</h2>
        <div className="flex flex-col gap-6 ">
          {course.spots.map((spot) => (
            <Card key={spot.id} className="overflow-hidden">
              <div className="h-40 w-full bg-gray-100">
                {spot.thumbnailUrl ? (
                  <Image
                    src={spot.thumbnailUrl}
                    alt={spot.title}
                    className="h-full w-full object-cover"
                    width={500}
                    height={300}
                  />
                ) : spot.imageUrl1 ? (
                  <Image
                    src={spot.imageUrl1}
                    alt={spot.title}
                    className="h-full w-full object-cover"
                    width={500}
                    height={300}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                    이미지가 없습니다.
                  </div>
                )}
              </div>
              <CardHeader className="space-y-3">
                <CardTitle className="text-xl">{spot.title}</CardTitle>
                <p className="text-sm text-gray-600">{spot.summary}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {spot.address1}
                  </p>
                  {spot.tel && (
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {spot.tel}
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    1인당 탄소 배출량 {spot.carbonEmissionPerPerson.toFixed(1)}
                    kg CO₂e
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {spot.tags.map((tag) => (
                    <span
                      key={`${spot.id}-${tag}`}
                      className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
