"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EcoTourCourseFilters } from "@/lib/api/eco-tour";
import { useEcoTourCourses } from "@/hooks/queries";
import { EcoTourCourseSummary } from "@/types";
import { Leaf, Loader2, MapPin } from "lucide-react";

const parseNumber = (value: string): number | undefined => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const parseTags = (value: string): string[] | undefined => {
  const tags = value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  return tags.length > 0 ? tags : undefined;
};

export default function EcoTourismCoursesPage() {
  const [formValues, setFormValues] = useState({
    areaId: "",
    sigunguId: "",
    categoryId: "",
    tags: "",
  });
  const [filters, setFilters] = useState<EcoTourCourseFilters | undefined>();

  const { data, isLoading, isError, error, isFetching } = useEcoTourCourses(
    filters
  );

  const courses = useMemo(
    () => data?.courses ?? [],
    [data?.courses]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextFilters: EcoTourCourseFilters = {
      areaId: parseNumber(formValues.areaId),
      sigunguId: parseNumber(formValues.sigunguId),
      categoryId: parseNumber(formValues.categoryId),
      tags: parseTags(formValues.tags),
    };

    setFilters(nextFilters);
  };

  const handleReset = () => {
    setFormValues({ areaId: "", sigunguId: "", categoryId: "", tags: "" });
    setFilters(undefined);
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">생태관광 코스</h1>
        <p className="text-gray-600">
          지역, 카테고리, 태그로 필터링하여 원하는 생태관광 코스를 찾아보세요.
        </p>
      </section>

      <section className="rounded-lg border bg-white p-6 shadow-sm">
        <form className="grid gap-4 md:grid-cols-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="areaId">시도 ID</Label>
            <Input
              id="areaId"
              name="areaId"
              inputMode="numeric"
              value={formValues.areaId}
              onChange={handleChange}
              placeholder="예: 1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sigunguId">시군구 ID</Label>
            <Input
              id="sigunguId"
              name="sigunguId"
              inputMode="numeric"
              value={formValues.sigunguId}
              onChange={handleChange}
              placeholder="예: 1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">카테고리 ID</Label>
            <Input
              id="categoryId"
              name="categoryId"
              inputMode="numeric"
              value={formValues.categoryId}
              onChange={handleChange}
              placeholder="예: 1"
            />
          </div>
          <div className="space-y-2 md:col-span-2 lg:col-span-1">
            <Label htmlFor="tags">태그 (쉼표 구분)</Label>
            <Input
              id="tags"
              name="tags"
              value={formValues.tags}
              onChange={handleChange}
              placeholder="국립공원,해안"
            />
          </div>
          <div className="flex items-end gap-2 md:col-span-2 lg:col-span-1">
            <Button type="submit" className="flex-1" disabled={isFetching}>
              {(isFetching || isLoading) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              필터 적용
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              초기화
            </Button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        {isError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error?.message || "코스 목록을 불러오는 중 오류가 발생했습니다."}
          </div>
        )}

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-md border bg-white p-6 text-center text-gray-500">
            조건에 맞는 생태관광 코스가 없습니다.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function CourseCard({ course }: { course: EcoTourCourseSummary }) {
  const topSpot = course.spots[0];

  return (
    <Card className="overflow-hidden">
      <div className="h-40 w-full bg-gray-100">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            이미지 없음
          </div>
        )}
      </div>
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {course.areaName} · {course.sigunguName}
          </span>
          <span className="flex items-center gap-1">
            <Leaf className="h-4 w-4" />
            {course.totalCarbonEmission.toFixed(1)}kg CO₂e
          </span>
        </div>
        <CardTitle className="text-xl">{course.title}</CardTitle>
        {topSpot && (
          <p className="text-sm text-gray-600">
            주요 코스: {topSpot.title} 등 {course.spots.length}개 장소
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {course.spots.flatMap((spot) => spot.tags).slice(0, 6).map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>조회수 {course.viewCount.toLocaleString()}회</span>
          <span>
            좋아요 {course.likeCount.toLocaleString()}개
            {course.isLiked ? " · 찜함" : ""}
          </span>
        </div>
        <Button asChild className="w-full">
          <Link href={`/eco-tourism-courses/${course.id}`}>코스 상세 보기</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
