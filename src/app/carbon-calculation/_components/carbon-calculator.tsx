"use client";

import { mockEcoTourRoutes, mockTransportOptions } from "@/app/data";
import { AppHeader } from "@/components/ui/header";
import LogoIcon from "@/components/ui/logo";
import { useFunnel } from "@/hooks/useFunnel";
import { getRouteLabel, ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, UseFormReturn, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowRight, IconLocation, IconMapPin } from "@tabler/icons-react";
import { useState } from "react";
import * as z from "zod";
import { TransportSelect } from "./transport-select";
import { CourseSelect } from "./course-select";
import { AddRouteButton } from "./add-route-button";
import { RouteItem } from "./route-item";
import {
  CarbonCalculationStep,
  mockAccommodationOptions,
  mockLocationOptions,
} from "./types";
import { AccommodationItem } from "./accommodation-item";
import { useRouter } from "next/navigation";
import { useLocations } from "@/hooks/queries";

// Form schema using zod
const carbonCalculatorSchema = z.object({
  personnel: z.number().min(1, "인원수는 1명 이상이어야 합니다"),
  routes: z.array(
    z.object({
      departureLocationId: z.string().optional(),
      arrivalLocationId: z.string().optional(),
      courseId: z.string().optional(),
      transportationTypeId: z.string(),
    })
  ),
  accommodation: z.array(
    z.object({
      accommodationTypeId: z.string(),
      checkInDate: z.date().optional(),
      checkOutDate: z.date().optional(),
    })
  ),
});

type FormData = z.infer<typeof carbonCalculatorSchema>;

const CarbonCalculator = () => {
  const [Funnel, Step, step, setStep] =
    useFunnel<CarbonCalculationStep>("PERSONNEL");

  const form = useForm<FormData>({
    resolver: zodResolver(carbonCalculatorSchema),
    defaultValues: {
      personnel: 1,
      routes: [],
      accommodation: [],
    },
  });
  const route = useRouter();

  const goToMainPage = () => {
    const formData = form.getValues();
    alert(`탄소 배출량 계산이 완료되었습니다!", ${JSON.stringify(formData)}`);

    route.push("/");
  };

  const getStepProgress = (_step: CarbonCalculationStep) => {
    switch (_step) {
      case "PERSONNEL":
        return 33;
      case "ROUTE+ECO_COURSES":
        return 66;
      case "ACCOMMODATION":
        return 100;
      default:
        return 0;
    }
  };
  return (
    <div className="w-full">
      <AppHeader
        showBackButton
        title={getRouteLabel(ROUTES.CARBON_CALCULATION)}
      />
      <div>
        <div className="flex items-center gap-2">
          <LogoIcon />
          <div className="text-2xl font-bold">그루미터</div>
        </div>
        <p>여행 계획을 입력하여 예상 탄소 배출량을 계산해보세요.</p>
      </div>
      <div className="flex gap-1 mt-2 w-full">
        <Progress
          value={getStepProgress(step) > 0 ? 100 : 0}
          className="flex-1 h-1"
        />
        <Progress
          value={getStepProgress(step) >= 66 ? 100 : 0}
          className="flex-1 h-1"
        />
        <Progress
          value={getStepProgress(step) > 66 ? 100 : 0}
          className="flex-1 h-1"
        />
      </div>
      <Funnel>
        <Step name="PERSONNEL">
          <PersonnelStep
            form={form}
            onClickNext={() => setStep("ROUTE+ECO_COURSES")}
          />
        </Step>
        <Step name="ROUTE+ECO_COURSES">
          <RouteEcoCoursesStep
            form={form}
            onClickNext={() => setStep("ACCOMMODATION")}
            onClickPrevious={() => setStep("PERSONNEL")}
          />
        </Step>
        <Step name="ACCOMMODATION">
          <AccommodationStep
            form={form}
            onClickPrevious={() => setStep("ROUTE+ECO_COURSES")}
            onClickNext={goToMainPage}
          />
        </Step>
      </Funnel>
    </div>
  );
};

export default CarbonCalculator;

interface CommonFormProps {
  form: UseFormReturn<FormData>;
  onClickNext: () => void;
}

type PersonnelStepProps = CommonFormProps;

const PersonnelStep = ({ form, onClickNext }: PersonnelStepProps) => {
  return (
    <div className="border border-gray-200 rounded-lg mt-4 p-4 flex flex-col gap-4">
      <div className="text-base font-semibold">인원수 입력</div>
      <div className="space-y-2">
        <Label htmlFor="personnel" className="text-sm">
          몇 명이서 여행을 계획하고 계신가요?
        </Label>
        <Input
          id="personnel"
          type="number"
          min="1"
          placeholder="인원수를 입력하세요"
          {...form.register("personnel", { valueAsNumber: true })}
          className="text-lg"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={onClickNext}>다음</Button>
      </div>
    </div>
  );
};

interface RouteEcoCoursesStepProps extends CommonFormProps {
  onClickPrevious: () => void;
}

const RouteEcoCoursesStep = ({
  form,
  onClickNext,
  onClickPrevious,
}: RouteEcoCoursesStepProps) => {
  const [selectedDepartureCity, setSelectedDepartureCity] =
    useState<string>("");
  const [selectedArrivalCity, setSelectedArrivalCity] = useState<string>("");
  const [selectedCustomRouteTransport, setSelectedCustomRouteTransport] =
    useState<string>("");
  const [selectedEcoCourse, setSelectedEcoCourse] = useState<string>("");
  const [selectedEcoCourseTransport, setSelectedEcoCourseTransport] =
    useState<string>("");

  const {
    fields: routeFields,
    append: appendRoute,
    remove: removeRoute,
  } = useFieldArray({
    control: form.control,
    name: "routes",
  });

  const enableToGoNext = routeFields.length > 0;

  const { data } = useLocations();
  console.log("locations data", data);

  const onClickAddCustomRoute = () => {
    if (
      selectedDepartureCity &&
      selectedArrivalCity &&
      selectedCustomRouteTransport
    ) {
      appendRoute({
        departureLocationId: selectedDepartureCity,
        arrivalLocationId: selectedArrivalCity,
        transportationTypeId: selectedCustomRouteTransport,
      });
      setSelectedDepartureCity("");
      setSelectedArrivalCity("");
      setSelectedCustomRouteTransport("");
    } else {
      alert("모든 필드를 선택해주세요.");
    }
  };

  const onClickAddEcoCourse = () => {
    if (selectedEcoCourse && selectedEcoCourseTransport) {
      appendRoute({
        courseId: selectedEcoCourse,
        transportationTypeId: selectedEcoCourseTransport,
      });
      setSelectedEcoCourseTransport("");
      setSelectedEcoCourse("");
    } else {
      alert("관광 코스를 선택해주세요.");
    }
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      {routeFields.length > 0 && (
        <>
          <div className="text-base font-semibold">추가된 여행 항목</div>
          {routeFields.map((route, index) => (
            <RouteItem
              key={route.id}
              departureCityName={
                mockLocationOptions.filter(
                  (option) => option.value === String(route.departureLocationId)
                )[0]?.label
              }
              arrivalCityName={
                mockLocationOptions.filter(
                  (option) => option.value === String(route.arrivalLocationId)
                )[0]?.label
              }
              courseName={
                mockEcoTourRoutes.filter(
                  (course) => course.value === String(route.courseId)
                )[0]?.title
              }
              transportIcon={
                mockTransportOptions.filter(
                  (option) =>
                    option.value === String(route.transportationTypeId)
                )[0]?.icon || ""
              }
              onDelete={() => removeRoute(index)}
            />
          ))}
        </>
      )}
      <div className="text-base font-semibold">경로 및 생태 관광 코스 선택</div>
      {/* 직접 경로 추가 */}
      <div className="border border-gray-200 rounded-lg p-2 flex flex-col gap-2">
        <div className="text-base font-medium text-gray-600 flex items-center gap-2">
          <IconLocation width={24} height={24} />
          <h6 className="text-base font-medium">직접 경로 추가</h6>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={selectedDepartureCity}
            onValueChange={setSelectedDepartureCity}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="출발지" />
            </SelectTrigger>
            <SelectContent>
              {mockLocationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <IconArrowRight />
          <Select
            value={selectedArrivalCity}
            onValueChange={setSelectedArrivalCity}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="도착지" />
            </SelectTrigger>
            <SelectContent>
              {mockLocationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <h6 className="text-base font-medium">교통 수단</h6>
        <TransportSelect
          options={mockTransportOptions}
          selected={
            selectedCustomRouteTransport
              ? { value: selectedCustomRouteTransport, label: "" }
              : null
          }
          onSelect={(item) => {
            if (item?.value) setSelectedCustomRouteTransport(item.value);
          }}
        />
        <AddRouteButton onClick={onClickAddCustomRoute} />
      </div>
      {/* 관광 코스 선택 */}
      <div className="border border-gray-200 rounded-lg p-2 flex flex-col gap-2">
        <div className="text-base font-medium text-gray-600 flex items-center gap-2">
          <IconMapPin width={24} height={24} />
          <h6 className="text-base font-medium">관광 코스 선택</h6>
        </div>
        <h6 className="text-base font-medium">코스</h6>
        <div className="max-h-40 overflow-y-auto">
          <CourseSelect
            options={mockEcoTourRoutes}
            selected={
              selectedEcoCourse ? { value: selectedEcoCourse, label: "" } : null
            }
            onSelect={(item) => {
              if (item?.value) setSelectedEcoCourse(item.value);
            }}
            getIcon={(item) => (
              <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                {item.thumbnailUrl}
              </span>
            )}
            getLabel={(item) => (
              <div className="flex flex-col">
                <span className="text-base font-bold text-gray-900">
                  {item.title}
                </span>
                <span className="text-sm text-gray-500">{item.areaName}</span>
              </div>
            )}
          />
        </div>
        <h6 className="text-base font-medium">교통 수단</h6>
        <TransportSelect
          options={mockTransportOptions}
          selected={
            selectedEcoCourseTransport
              ? { value: selectedEcoCourseTransport, label: "" }
              : null
          }
          onSelect={(item) => {
            if (item?.value) setSelectedEcoCourseTransport(item.value);
          }}
        />
        <AddRouteButton onClick={onClickAddEcoCourse} />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onClickPrevious}>
          이전
        </Button>
        <Button disabled={!enableToGoNext} onClick={onClickNext}>
          다음
        </Button>
      </div>
    </div>
  );
};

interface AccommodationStepProps extends CommonFormProps {
  onClickPrevious: () => void;
}

const AccommodationStep = ({
  form,
  onClickPrevious,
  onClickNext,
}: AccommodationStepProps) => {
  const [accommodationPeriod, setAccommodationPeriod] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [selectedAccommodation, setSelectedAccommodation] =
    useState<string>("");

  const {
    fields: accommodationFields,
    append: appendAccommodation,
    remove: removeAccommodation,
  } = useFieldArray({
    control: form.control,
    name: "accommodation",
  });

  const enableToGoNext = accommodationFields.length > 0;

  const onClickAddAccommodation = () => {
    if (selectedAccommodation) {
      appendAccommodation({
        accommodationTypeId: selectedAccommodation,
      });
      setSelectedAccommodation("");
    } else {
      alert("숙박 유형을 선택해주세요.");
    }
  };
  return (
    <div className="border border-gray-200 rounded-lg mt-4 p-4 flex flex-col gap-4">
      <h2>숙박 정보 입력</h2>
      <>
        {accommodationFields.map((item, index) => {
          const typeLabel =
            mockAccommodationOptions.find(
              (opt) => opt.value === item.accommodationTypeId
            )?.label || item.accommodationTypeId;
          return (
            <AccommodationItem
              key={item.id}
              checkInDate={item.checkInDate?.toISOString() || ""}
              checkOutDate={item.checkOutDate?.toISOString() || ""}
              typeLabel={typeLabel}
              onDelete={() => removeAccommodation(index)}
            />
          );
        })}
      </>
      <div className="border border-gray-200 rounded-lg p-2 flex flex-col gap-2">
        <h6 className="text-base font-medium">숙박 기간</h6>
        <div className="flex gap-4">
          <Input
            type="date"
            value={accommodationPeriod[0]?.toISOString().split("T")[0] || ""}
            onChange={(e) =>
              setAccommodationPeriod([
                new Date(e.target.value),
                accommodationPeriod[1],
              ])
            }
            placeholder="체크인"
            className="flex-1"
          />
          <Input
            type="date"
            value={accommodationPeriod[1]?.toISOString().split("T")[0] || ""}
            onChange={(e) =>
              setAccommodationPeriod([
                accommodationPeriod[0],
                new Date(e.target.value),
              ])
            }
            placeholder="체크아웃"
            className="flex-1"
          />
        </div>
        <h6 className="text-base font-medium">숙박 유형</h6>
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {mockAccommodationOptions.map((option) => (
              <Card
                key={option.value}
                className={`p-2 cursor-pointer border ${
                  selectedAccommodation === option.value
                    ? "bg-green-100 border-green-600"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedAccommodation(option.value)}
              >
                <div className="flex items-center gap-2 h-full">
                  <span>{option.label}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <AddRouteButton
        buttonText="숙박 추가"
        onClick={onClickAddAccommodation}
      />
      <div className="flex gap-2">
        <Button variant="outline" onClick={onClickPrevious}>
          이전
        </Button>
        <Button
          disabled={!enableToGoNext}
          onClick={() => {
            alert("API 연결 전, 탄소 배출량 계산 완료!");
            onClickNext();
          }}
        >
          완료
        </Button>
      </div>
    </div>
  );
};
