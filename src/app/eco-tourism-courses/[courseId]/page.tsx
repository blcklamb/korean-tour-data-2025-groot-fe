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
import { EcoTourCourseDetail } from "@/types";

const MOCK_COURSE: EcoTourCourseDetail = {
  id: 0,
  title: "문경새재 벚꽃길 (모의 데이터)",
  thumbnailUrl:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  areaName: "경상북도",
  sigunguName: "문경시",
  spots: [
    {
      id: 1,
      title: "국립대야산자연휴양림",
      summary:
        "맑은 계곡과 울창한 숲으로 유명한 휴양림으로 삼림욕과 트레킹에 안성맞춤입니다.",
      address1: "경상북도 문경시 가은읍 용추길 31-35",
      mapX: 127.9619770044,
      mapY: 36.670906003,
      thumbnailUrl:
        "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
      imageUrl1:
        "https://images.githubusercontent.com/mock/national-forest.jpg",
      tel: "1588-3250",
      tags: ["국립공원", "자연관광"],
      carbonEmissionPerPerson: 2.5,
    },
    {
      id: 2,
      title: "문경새재 도립공원",
      summary:
        "역사와 자연이 공존하는 고갯길로 봄철 벚꽃과 가을 단풍이 아름답습니다.",
      address1: "경상북도 문경시 문경읍 새재로 932",
      mapX: 128.150977,
      mapY: 36.805834,
      thumbnailUrl:
        "https://images.unsplash.com/photo-1455218873509-8097305ee378?auto=format&fit=crop&w=1200&q=80",
      imageUrl1: "https://images.githubusercontent.com/mock/mungyeong-park.jpg",
      tel: "054-571-0709",
      tags: ["트레킹", "문화유산"],
      carbonEmissionPerPerson: 2.1,
    },
  ],
  totalCarbonEmission: 5.0,
  viewCount: 1250,
  likeCount: 89,
  isLiked: false,
  createdAt: new Date().toISOString(),
};

export default function EcoTourCourseDetailPage() {
  const params = useParams<{ courseId: string }>();
  const courseIdParam = Array.isArray(params?.courseId)
    ? params?.courseId[0]
    : params?.courseId;

  const router = useRouter();

  const {
    data: course,
    isLoading,
    error,
  } = useEcoTourCourse(courseIdParam ?? "");

  const toggleLikeMutation = useToggleEcoTourCourseLike();

  const shouldUseMockData = !isLoading && !course;
  const displayCourse: EcoTourCourseDetail = course ?? MOCK_COURSE;

  const likeButtonLabel = useMemo(() => {
    if (!displayCourse) return "좋아요";
    return displayCourse.isLiked ? "좋아요 취소" : "좋아요";
  }, [displayCourse]);

  const handleToggleLike = () => {
    if (shouldUseMockData || !course) return;
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

  return (
    <div className="space-y-8">
      <AppHeader
        showBackButton
        title={displayCourse.title}
        onBackClick={() =>
          router.push(getRouteHref(ROUTES.ECO_TOURISM_COURSES))
        }
      />
      {shouldUseMockData && (
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
          <p>
            실시간 데이터를 불러오지 못해 예시 데이터로 페이지를 구성했습니다.
          </p>
          {error?.message && (
            <p className="mt-2 text-xs text-yellow-600/80">
              원인: {error.message}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="h-56 w-full bg-gray-100">
            {displayCourse.thumbnailUrl ? (
              <Image
                src={displayCourse.thumbnailUrl}
                alt={displayCourse.title}
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
                {displayCourse.areaName} · {displayCourse.sigunguName}
              </span>
              <span>조회수 {displayCourse.viewCount.toLocaleString()}회</span>
              <span>
                총 탄소 배출량 {displayCourse.totalCarbonEmission.toFixed(1)}kg
                CO₂e
              </span>
              <span>
                등록일 {new Date(displayCourse.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                {displayCourse.title}
              </h1>
              <div className="flex flex-col items-end gap-2">
                <Button
                  onClick={handleToggleLike}
                  disabled={shouldUseMockData || toggleLikeMutation.isPending}
                  variant={displayCourse.isLiked ? "default" : "secondary"}
                >
                  {toggleLikeMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ThumbsUp className="mr-2 h-4 w-4" />
                  )}
                  {likeButtonLabel} ({displayCourse.likeCount.toLocaleString()})
                </Button>
                {!shouldUseMockData && toggleLikeMutation.isError && (
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
          {displayCourse.spots.map((spot) => (
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
