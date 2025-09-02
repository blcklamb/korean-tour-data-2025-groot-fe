/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { mockEcoTourRoutes, mockTransportOptions } from "@/app/data";
import { AppHeader } from "@/components/ui/header";
import LogoIcon from "@/components/ui/logo";
import { useFunnel } from "@/hooks/useFunnel";
import { getRouteLabel, ROUTES } from "@/lib/routes";
import {
  Button,
  ButtonProps,
  Card,
  ComboboxItem,
  Flex,
  Group,
  NumberInput,
  Progress,
  Select,
  SimpleGrid,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import {
  IconArrowRight,
  IconLocation,
  IconMapPin,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import styles from "./carbon-calculator.module.css";

// 지역 옵션 리스트 (도시만, unique id, 경상북도 시 추가)
const mockLocationOptions: ComboboxItem[] = [
  { value: "1", label: "서울" },
  { value: "2", label: "수원" },
  { value: "3", label: "용인" },
  { value: "4", label: "고양" },
  { value: "5", label: "전주" },
  { value: "6", label: "천안" },
  { value: "7", label: "안산" },
  { value: "8", label: "안양" },
  { value: "9", label: "포항" },
  { value: "10", label: "의정부" },
  { value: "11", label: "시흥" },
  { value: "12", label: "평택" },
  { value: "13", label: "김포" },
  { value: "14", label: "광명" },
  { value: "15", label: "군포" },
  { value: "16", label: "하남" },
  // 경상북도 시 추가
  { value: "17", label: "울산" },
  { value: "18", label: "구미" },
  { value: "19", label: "경주" },
  { value: "20", label: "영주" },
  { value: "21", label: "안동" },
  { value: "22", label: "밀양" },
  { value: "23", label: "울주군" },
];

// 새로운 교통수단 리스트 (unique id, value 추가)
// const mockTransportOptions = [
//   { id: 1, value: "walking", icon: "🚶", label: "도보" },
//   { id: 2, value: "bicycle", icon: "🚴", label: "자전거" },
//   { id: 3, value: "motorcycle", icon: "🏍️", label: "오토바이" },
//   { id: 4, value: "subway", icon: "🚇", label: "지하철" },
//   { id: 5, value: "ktx", icon: "🚄", label: "기차 (KTX)" },
//   { id: 6, value: "train", icon: "🚆", label: "기차 (일반)" },
//   { id: 7, value: "bus", icon: "🚌", label: "버스" },
//   { id: 8, value: "car_gas", icon: "🚗", label: "승용차 (내연기관)" },
//   { id: 9, value: "car_hybrid", icon: "🚙", label: "승용차 (하이브리드)" },
//   { id: 10, value: "car_electric", icon: "⚡", label: "승용차 (전기차)" },
//   { id: 11, value: "airplane", icon: "✈️", label: "비행기" },
//   { id: 12, value: "ship", icon: "🚢", label: "여객선" },
// ];

const mockAccommodationOptions: ComboboxItem[] = [
  { value: "1", label: "호텔 (5성급)" },
  { value: "2", label: "호텔 (4성급)" },
  { value: "3", label: "호텔 (3성급 이하)" },
  { value: "4", label: "게스트하우스" },
  { value: "5", label: "캠핑 (시설 있음)" },
  { value: "6", label: "캠핑 (시설 없음)" },
  { value: "7", label: "친환경 인증 호텔" },
  { value: "8", label: "자가 숙박 (친척/지인 집)" },
];

type CarbonCalculationStep = "PERSONNEL" | "ROUTE+ECO_COURSES" | "ACCOMODATION";

interface CarbonCalculatorFormValues {
  personnel: number;
  // todo: naming
  routes: {
    departureLocationId?: number;
    arrivalLocationId?: number;
    courseId?: number; // 생태 관광 코스 ID
    transportationTypeId: number;
  }[];
  // routes: {
  //   departureCityId: string;
  //   arrivalCityId: string;
  //   transportationId: string;
  // }[];
  // ecoCourses: { courseId: string; transportationId: string }[];
  accomodation: {
    typeId: string;
    checkInDate: string;
    checkOutDate: string;
  }[];
}

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
    <div style={{ width: "100%" }}>
      <AppHeader
        showBackButton
        title={getRouteLabel(ROUTES.CARBON_CALCULATION)}
      />
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <LogoIcon />
          <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>그루미터</div>
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
          <div className={styles.section}>
            <h2>숙박 정보 입력</h2>
            <div className={styles.buttonGroup}>
              <Button variant="light" onClick={() => setStep("ACCOMODATION")}>
                이전
              </Button>
              <Button onClick={() => alert("탄소 배출량 계산 완료!")}>
                완료
              </Button>
            </div>
          </div>
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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PersonnelStepProps extends CommonFormProps {}

const PersonnelStep = ({ form, onClickNext }: PersonnelStepProps) => {
  return (
    <div className={styles.section}>
      <div className={styles.subTitle}>인원수 입력</div>
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
      <div className={styles.buttonGroup}>
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
  //   const [selectedCourse, setSelectedCourse] = useState<EcoTourRoute | null>(
  //     null
  //   );
  const [selectedDepartureCity, setSelectedDepartureCity] =
    useState<ComboboxItem | null>(null);
  const [selectedArrivalCity, setSelectedArrivalCity] =
    useState<ComboboxItem | null>(null);
  const [selectedTransport, setSelectedTransport] =
    useState<ComboboxItem | null>(null);

  const onClickAddRoute = () => {
    if (selectedDepartureCity && selectedArrivalCity && selectedTransport) {
      form.insertListItem("routes", {
        departureCityId: selectedDepartureCity.value,
        arrivalCityId: selectedArrivalCity.value,
        transportationId: selectedTransport.value,
      });
      setSelectedDepartureCity(null);
      setSelectedArrivalCity(null);
      setSelectedTransport(null);
    } else {
      alert("모든 필드를 선택해주세요.");
    }
  };

  return (
    <Flex direction="column" gap="md" style={{ padding: "16px 0px" }}>
      {form.getValues().routes.length > 0 && (
        <>
          <div className={styles.subTitle}>추가된 여행 항목</div>
          {form.getValues().routes.map((route, index) => (
            <RouteItem
              key={index}
              {...route}
              departureCityName={
                mockLocationOptions.filter(
                  (option) => Number(option.value) === route.departureLocationId
                )[0]?.label
              }
              arrivalCityName={
                mockLocationOptions.filter(
                  (option) => Number(option.value) === route.arrivalLocationId
                )[0]?.label
              }
              courseName={
                mockEcoTourRoutes.filter(
                  (course) => course.id === route.courseId
                )[0]?.title
              }
              transportIcon={
                mockTransportOptions.filter(
                  (option) =>
                    Number(option.value) === route.transportationTypeId
                )[0]?.icon
              }
              onDelete={() => form.removeListItem("routes", index)}
            />
          ))}
        </>
      )}
      <div className={styles.subTitle}>경로 및 생태 관광 코스 선택</div>
      {/* 직접 경로 추가 */}
      <div className={styles.subSection}>
        <div className={styles.subSectionTitle}>
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
          selected={selectedTransport}
          onSelect={(item) => {
            setSelectedTransport(item as ComboboxItem);
          }}
        />
        <AddRouteButton onClick={onClickAddRoute} />
      </div>
      {/* 관광 코스 선택 */}
      <div className={styles.subSection}>
        <div className={styles.subSectionTitle}>
          <IconMapPin width={24} height={24} />
          <Title order={6}>관광 코스 선택</Title>
        </div>
        <CourseSelect
          options={mockEcoTourRoutes}
          selected={null}
          onSelect={() => {}}
          getIcon={(item) => (
            <span className={styles.routeIcon}>{item.thumbnailUrl}</span>
          )}
          getLabel={(item) => (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span className={styles.routeName}>{item.title}</span>
              <span className={styles.routeLocation}>{item.areaName}</span>
            </div>
          )}
        />
      </div>
      <div className={styles.buttonGroup}>
        <Button variant="light" onClick={onClickPrevious}>
          이전
        </Button>
        <Button onClick={onClickNext}>다음</Button>
      </div>
    </Flex>
  );
};

interface TransportOption {
  id: number;
  label: string;
  icon?: string;
  value?: string;
}

interface TransportSelectProps {
  options: TransportOption[];
  selected: ComboboxItem | null;
  onSelect: (item: TransportOption) => void;
  getIcon?: (item: TransportOption) => React.ReactNode;
  getLabel?: (item: TransportOption) => React.ReactNode;
}

function TransportSelect(props: TransportSelectProps) {
  const { options, selected, onSelect, getIcon, getLabel } = props;
  return (
    <SimpleGrid cols={3} spacing="xs">
      {options.map((item) => (
        <Card
          key={item.id}
          withBorder
          padding="xs"
          className={
            item.value && selected?.value && item.value === selected.value
              ? styles.activeTransportCard
              : styles.transportCard
          }
          onClick={() => onSelect(item as TransportOption)}
        >
          <Flex
            direction={"column"}
            justify={"center"}
            align="center"
            gap="xs"
            h={"100%"}
          >
            <span>{getIcon ? getIcon(item) : item.icon}</span>
            <span style={{ fontSize: "12px" }}>
              {getLabel ? getLabel(item) : item.label || item.value}
            </span>
          </Flex>
        </Card>
      ))}
    </SimpleGrid>
  );
}

interface CourseOption {
  id: number;
  title: string;
  thumbnailUrl: string;
  areaName: string;
  sigunguName: string;
}

interface CourseSelectProps {
  options: CourseOption[];
  selected: ComboboxItem | null;
  onSelect: (item: CourseOption) => void;
  getIcon?: (item: CourseOption) => React.ReactNode;
  getLabel?: (item: CourseOption) => React.ReactNode;
}

function CourseSelect(props: CourseSelectProps) {
  const { options, selected, onSelect, getIcon, getLabel } = props;
  return (
    <SimpleGrid cols={3} spacing="xs">
      {options.map((item) => (
        <Card
          key={item.id}
          withBorder
          padding="xs"
          className={
            selected?.value && item.title === selected.value
              ? styles.activeCourseCard
              : styles.courseCard
          }
          onClick={() => onSelect(item as CourseOption)}
        >
          <Flex
            direction={"column"}
            justify={"center"}
            align="center"
            gap="xs"
            h={"100%"}
          >
            <span>{getIcon ? getIcon(item) : item.thumbnailUrl}</span>
            <span style={{ fontSize: "12px" }}>
              {getLabel ? getLabel(item) : item.title}
            </span>
          </Flex>
        </Card>
      ))}
    </SimpleGrid>
  );
}

interface AddRouteButtonProps extends ButtonProps {
  onClick?: () => void;
}
const AddRouteButton = (props: AddRouteButtonProps) => {
  const { onClick, ...rest } = props;
  return (
    <Button
      variant="subtle"
      leftSection={<IconPlus />}
      className={styles.addRouteButton}
      onClick={onClick}
      {...rest}
    >
      경로 추가
    </Button>
  );
};

interface RouteItemProps {
  departureCityName?: string;
  arrivalCityName?: string;
  courseName?: string;
  transportIcon: string;
  onDelete: () => void;
}

const RouteItem = (props: RouteItemProps) => {
  const { departureCityName, arrivalCityName, courseName, transportIcon } =
    props;
  return (
    <Card padding="xs" className={styles.routeItem}>
      <Flex justify={"space-between"} align="center">
        <Flex direction={"column"} gap="xs" align={"center"}>
          <Flex gap="xs" align={"center"}>
            <span style={{ fontSize: "20px" }}>{transportIcon}</span>
            {!courseName ? (
              <Flex gap="xs">
                <span>{departureCityName}</span>→<span>{arrivalCityName}</span>
              </Flex>
            ) : (
              <span>{courseName}</span>
            )}
          </Flex>
        </Flex>
        <UnstyledButton>
          <IconX size={16} color="red" />
        </UnstyledButton>
      </Flex>
    </Card>
  );
};
