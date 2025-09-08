"use client";

import { mockEcoTourRoutes, mockTransportOptions } from "@/app/data";
import { AppHeader } from "@/components/ui/header";
import LogoIcon from "@/components/ui/logo";
import { useFunnel } from "@/hooks/useFunnel";
import { getRouteLabel, ROUTES } from "@/lib/routes";
import {
  Button,
  Card,
  ComboboxItem,
  Flex,
  Group,
  NumberInput,
  Progress,
  Select,
  Title,
} from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import { DatePickerInput } from "@mantine/dates";
import {
  IconArrowRight,
  IconCalendar,
  IconLocation,
  IconMapPin,
} from "@tabler/icons-react";
import { useState } from "react";
import { TransportSelect } from "./transport-select";
import { CourseSelect } from "./course-select";
import { AddRouteButton } from "./add-route-button";
import { RouteItem } from "./route-item";
import {
  CarbonCalculationStep,
  CarbonCalculatorFormValues,
  mockAccommodationOptions,
  mockLocationOptions,
} from "./types";
import { AccomodationItem } from "./accomodation-item";
import { useRouter } from "next/navigation";

const CarbonCalculator = () => {
  const [Funnel, Step, step, setStep] =
    useFunnel<CarbonCalculationStep>("PERSONNEL");

  const form = useForm<CarbonCalculatorFormValues>({
    mode: "uncontrolled",
    initialValues: {
      personnel: 1,
      routes: [],
      accomodation: [],
    },
  });
  const route = useRouter();

  const goToMainPage = () => {
    alert(
      `탄소 배출량 계산이 완료되었습니다!", ${JSON.stringify(form.getValues())}`
    );

    route.push("/");
  };

  const getStepProgress = (_step: CarbonCalculationStep) => {
    switch (_step) {
      case "PERSONNEL":
        return 33;
      case "ROUTE+ECO_COURSES":
        return 66;
      case "ACCOMODATION":
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
      <Group grow gap={5} mt="xs" w={"100%"}>
        <Progress
          size="xs"
          color={"eco-green"}
          value={getStepProgress(step) > 0 ? 100 : 0}
          transitionDuration={0}
        />
        <Progress
          size="xs"
          color={"eco-green"}
          value={getStepProgress(step) >= 66 ? 100 : 0}
          transitionDuration={0}
        />
        <Progress
          size="xs"
          color={"eco-green"}
          value={getStepProgress(step) > 66 ? 100 : 0}
          transitionDuration={0}
        />
      </Group>
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
            onClickNext={() => setStep("ACCOMODATION")}
            onClickPrevious={() => setStep("PERSONNEL")}
          />
        </Step>
        <Step name="ACCOMODATION">
          <AccomodationStep
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
  form: UseFormReturnType<CarbonCalculatorFormValues>;
  onClickNext: () => void;
}

type PersonnelStepProps = CommonFormProps;

const PersonnelStep = ({ form, onClickNext }: PersonnelStepProps) => {
  return (
    <div className="border border-gray-200 rounded-lg mt-4 p-4 flex flex-col gap-4">
      <div className="text-base font-semibold">인원수 입력</div>
      <NumberInput
        key={form.key("personnel")}
        label="몇 명이서 여행을 계획하고 계신가요?"
        placeholder="인원수를 입력하세요"
        min={1}
        size="lg"
        styles={{
          label: { fontSize: "0.875rem", marginBottom: "4px" },
        }}
        {...form.getInputProps("personnel")}
      />
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
    useState<ComboboxItem | null>(null);
  const [selectedArrivalCity, setSelectedArrivalCity] =
    useState<ComboboxItem | null>(null);
  const [selectedCustomRouteTransport, setSelectedCustomRouteTransport] =
    useState<ComboboxItem | null>(null);
  const [selectedEcoCourse, setSelectedEcoCourse] =
    useState<ComboboxItem | null>(null);
  const [selectedEcoCourseTransport, setSelectedEcoCourseTransport] =
    useState<ComboboxItem | null>(null);

  const enableToGoNext = form.getValues().routes.length > 0;

  const onClickAddCustomRoute = () => {
    if (
      selectedDepartureCity &&
      selectedArrivalCity &&
      selectedCustomRouteTransport
    ) {
      form.insertListItem("routes", {
        departureLocationId: selectedDepartureCity.value,
        arrivalLocationId: selectedArrivalCity.value,
        transportationTypeId: selectedCustomRouteTransport.value,
      });
      setSelectedDepartureCity(null);
      setSelectedArrivalCity(null);
      setSelectedCustomRouteTransport(null);
    } else {
      alert("모든 필드를 선택해주세요.");
    }
  };

  const onClickAddEcoCourse = () => {
    if (selectedEcoCourse && selectedEcoCourseTransport) {
      form.insertListItem("routes", {
        courseId: selectedEcoCourse.value,
        transportationTypeId: selectedEcoCourseTransport.value,
      });
      setSelectedEcoCourseTransport(null);
      setSelectedEcoCourse(null);
    } else {
      alert("관광 코스를 선택해주세요.");
    }
  };

  return (
    <Flex direction="column" gap="md" className="py-4">
      {form.getValues().routes.length > 0 && (
        <>
          <div className="text-base font-semibold">추가된 여행 항목</div>
          {form.getValues().routes.map((route, index) => (
            <RouteItem
              key={index}
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
              onDelete={() => form.removeListItem("routes", index)}
            />
          ))}
        </>
      )}
      <div className="text-base font-semibold">경로 및 생태 관광 코스 선택</div>
      {/* 직접 경로 추가 */}
      <div className="border border-gray-200 rounded-lg p-2 flex flex-col gap-2">
        <div className="text-base font-medium text-gray-600 flex items-center gap-2">
          <IconLocation width={24} height={24} />
          <Title order={6}>직접 경로 추가</Title>
        </div>
        <Flex align={"center"} gap="xs">
          <Select
            placeholder="출발지"
            data={mockLocationOptions}
            value={selectedDepartureCity ? selectedDepartureCity.value : null}
            searchable
            onChange={(_value, option) =>
              setSelectedDepartureCity({
                value: option.value,
                label: option.label,
              })
            }
          />
          <IconArrowRight />
          <Select
            placeholder="도착지"
            data={mockLocationOptions}
            value={selectedArrivalCity ? selectedArrivalCity.value : null}
            searchable
            onChange={(_value, option) => setSelectedArrivalCity(option)}
          />
        </Flex>
        <Title order={6}>교통 수단</Title>
        <TransportSelect
          options={mockTransportOptions}
          selected={selectedCustomRouteTransport}
          onSelect={(item) => {
            setSelectedCustomRouteTransport(item as ComboboxItem);
          }}
        />
        <AddRouteButton onClick={onClickAddCustomRoute} />
      </div>
      {/* 관광 코스 선택 */}
      <div className="border border-gray-200 rounded-lg p-2 flex flex-col gap-2">
        <div className="text-base font-medium text-gray-600 flex items-center gap-2">
          <IconMapPin width={24} height={24} />
          <Title order={6}>관광 코스 선택</Title>
        </div>
        <Title order={6}>코스</Title>
        <div className="max-h-40 overflow-y-auto">
          <CourseSelect
            options={mockEcoTourRoutes}
            selected={selectedEcoCourse}
            onSelect={(item) => {
              setSelectedEcoCourse(item as ComboboxItem);
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
        <Title order={6}>교통 수단</Title>
        <TransportSelect
          options={mockTransportOptions}
          selected={selectedEcoCourseTransport}
          onSelect={(item) => {
            setSelectedEcoCourseTransport(item as ComboboxItem);
          }}
        />
        <AddRouteButton onClick={onClickAddEcoCourse} />
      </div>
      <div className="flex gap-2">
        <Button variant="light" onClick={onClickPrevious}>
          이전
        </Button>
        <Button disabled={!enableToGoNext} onClick={onClickNext}>
          다음
        </Button>
      </div>
    </Flex>
  );
};

interface AccomodationStepProps extends CommonFormProps {
  onClickPrevious: () => void;
}

const AccomodationStep = ({
  form,
  onClickPrevious,
  onClickNext,
}: AccomodationStepProps) => {
  const [accomodationPeriod, setAccomodationPeriod] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [selectedAccomodation, setSelectedAccomodation] =
    useState<ComboboxItem | null>(null);

  const enableToGoNext = form.getValues().accomodation.length > 0;

  const onClickAddAccomodation = () => {
    if (selectedAccomodation) {
      form.insertListItem("accomodation", {
        accomodationTypeId: selectedAccomodation.value,
      });
      setSelectedAccomodation(null);
    } else {
      alert("숙박 유형을 선택해주세요.");
    }
  };
  return (
    <div className="border border-gray-200 rounded-lg mt-4 p-4 flex flex-col gap-4">
      <h2>숙박 정보 입력</h2>
      <>
        {form.getValues().accomodation.map((item, index) => {
          const typeLabel =
            mockAccommodationOptions.find(
              (opt) => opt.value === item.accomodationTypeId
            )?.label || item.accomodationTypeId;
          return (
            <AccomodationItem
              key={index}
              checkInDate={item.checkInDate}
              checkOutDate={item.checkOutDate}
              typeLabel={typeLabel}
              onDelete={() => form.removeListItem("accomodation", index)}
            />
          );
        })}
      </>
      <div className="border border-gray-200 rounded-lg p-2 flex flex-col gap-2">
        <Title order={6}>숙박 기간</Title>
        <Flex gap="md">
          <DatePickerInput
            leftSection={<IconCalendar size={18} stroke={1.5} />}
            type="range"
            placeholder="체크인 - 체크아웃"
            style={{ flex: 1 }}
            value={accomodationPeriod}
            onChange={(date) =>
              setAccomodationPeriod(date as [Date | null, Date | null])
            }
          />
        </Flex>
        <Title order={6}>숙박 유형</Title>
        <Flex
          direction={"column"}
          gap="xs"
          style={{
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          <Flex direction={"column"} gap="xs">
            {mockAccommodationOptions.map((option) => (
              <Card
                key={option.value}
                withBorder
                padding="xs"
                className={
                  selectedAccomodation?.value &&
                  option.value === selectedAccomodation.value
                    ? "bg-green-100 border-green-600"
                    : ""
                }
                onClick={() => setSelectedAccomodation(option)}
              >
                <Flex align="center" gap="xs" h={"100%"}>
                  <span>{option.label}</span>
                </Flex>
              </Card>
            ))}
          </Flex>
        </Flex>
      </div>
      <AddRouteButton buttonText="숙박 추가" onClick={onClickAddAccomodation} />
      <div className="flex gap-2">
        <Button variant="light" onClick={onClickPrevious}>
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
