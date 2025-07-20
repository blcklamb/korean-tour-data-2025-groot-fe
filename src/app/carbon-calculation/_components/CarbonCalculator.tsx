"use client";

import { useFunnel } from "@/hooks/useFunnel";
import { Button, Group, NumberInput, Progress } from "@mantine/core";
import styles from "./CarbonCalulator.module.css";
import { useForm, UseFormReturnType } from "@mantine/form";
import { IconMapPin } from "@tabler/icons-react";
import { mockEcoTourRoutes } from "@/app/data";

// 지역 옵션 리스트 (도시만, unique id, 경상북도 시 추가)
const mockLocationOptions = [
  { id: 1, value: "seoul", label: "서울" },
  { id: 2, value: "suwon", label: "수원" },
  { id: 3, value: "yongin", label: "용인" },
  { id: 4, value: "goyang", label: "고양" },
  { id: 5, value: "jeonju", label: "전주" },
  { id: 6, value: "cheonan", label: "천안" },
  { id: 7, value: "ansan", label: "안산" },
  { id: 8, value: "anyang", label: "안양" },
  { id: 9, value: "pohang", label: "포항" },
  { id: 10, value: "uijeongbu", label: "의정부" },
  { id: 11, value: "siheung", label: "시흥" },
  { id: 12, value: "pyeongtaek", label: "평택" },
  { id: 13, value: "kimpo", label: "김포" },
  { id: 14, value: "gwangmyeong", label: "광명" },
  { id: 15, value: "gunpo", label: "군포" },
  { id: 16, value: "hanam", label: "하남" },
  // 경상북도 시 추가
  { id: 17, value: "ulsan", label: "울산" },
  { id: 18, value: "gumi", label: "구미" },
  { id: 19, value: "gyeongju", label: "경주" },
  { id: 20, value: "yeongju", label: "영주" },
  { id: 21, value: "andong", label: "안동" },
  { id: 22, value: "miryang", label: "밀양" },
  { id: 23, value: "ulju", label: "울주군" },
];

// 경상북도 관광코스
const mockTourismCourses = [
  { id: 1, value: "gyeongju", label: "경주" },
  { id: 2, value: "ulsan", label: "울산" },
  { id: 3, value: "gumi", label: "구미" },
  { id: 4, value: "yeongju", label: "영주" },
  { id: 5, value: "andong", label: "안동" },
  { id: 6, value: "miryang", label: "밀양" },
];

// 새로운 교통수단 리스트 (unique id)
const mockTransportOptions = {
  walking: { id: 1, icon: "🚶", label: "도보" },
  bicycle: { id: 2, icon: "🚴", label: "자전거" },
  motorcycle: { id: 3, icon: "🏍️", label: "오토바이" },
  subway: { id: 4, icon: "🚇", label: "지하철" },
  ktx: { id: 5, icon: "🚄", label: "기차 (KTX)" },
  train: { id: 6, icon: "🚆", label: "기차 (일반)" },
  bus: { id: 7, icon: "🚌", label: "버스" },
  car_gas: { id: 8, icon: "🚗", label: "승용차 (내연기관)" },
  car_hybrid: { id: 9, icon: "🚙", label: "승용차 (하이브리드)" },
  car_electric: { id: 10, icon: "⚡", label: "승용차 (전기차)" },
  airplane: { id: 11, icon: "✈️", label: "비행기" },
  ship: { id: 12, icon: "🚢", label: "여객선" },
};

const mockAccommodationOptions = [
  { id: 1, value: "hotel_5", label: "호텔 (5성급)" },
  { id: 2, value: "hotel_4", label: "호텔 (4성급)" },
  { id: 3, value: "hotel_3", label: "호텔 (3성급 이하)" },
  { id: 4, value: "guesthouse", label: "게스트하우스" },
  { id: 5, value: "camping_facility", label: "캠핑 (시설 있음)" },
  { id: 6, value: "camping_no_facility", label: "캠핑 (시설 없음)" },
  { id: 7, value: "eco_hotel", label: "친환경 인증 호텔" },
  { id: 8, value: "private_home", label: "자가 숙박 (친척/지인 집)" },
];

type CarbonCalculationStep = "PERSONNEL" | "ROUTE+ECO_COURSES" | "ACCOMODATION";

interface CarbonCalculatorFormValues {
  personnel: number;
  routes: {
    departureCityId: number;
    arrivalCityId: number;
    transportationId: number;
  }[];
  ecoCourses: { courseId: number; transportationId: number }[];
  accomodation: {
    typeId: number;
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
      ecoCourses: [],
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
      <div>
        <h1>그루미터</h1>
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
          {/* <div className={styles.section}>
            <h2>경로 및 생태 관광 코스 선택</h2>
            <div className={styles.buttonGroup}>
              <Button variant="light" onClick={() => setStep("PERSONNEL")}>
                이전
              </Button>
              <Button onClick={() => setStep("ACCOMODATION")}>다음</Button>
            </div>
          </div> */}
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
              <Button variant="light" onClick={() => setStep("PERSONNEL")}>
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
  return (
    <div className={styles.section}>
      {form.getValues().routes.map((route, index) => (
        <div key={index} className={styles.routeItem}>
          <div>
            <strong>출발 도시 ID:</strong> {route.departureCityId}
          </div>
          <div>
            <strong>도착 도시 ID:</strong> {route.arrivalCityId}
          </div>
          <div>
            <strong>교통수단 ID:</strong> {route.transportationId}
          </div>
        </div>
      ))}
      <div className={styles.subTitle}>경로 및 생태 관광 코스 선택</div>
      {/* 여기에 경로 및 생태 관광 코스 선택 UI를 추가 */}
      <div className={styles.subSection}>
        <div className={styles.subSectionTitle}>
          <IconMapPin width={24} height={24} />
          관광 코스 선택
        </div>
        <div
          style={{
            overflow: "scroll",
            height: "200px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {mockEcoTourRoutes.map((route) => (
            <div key={route.id} className={styles.courseItem}>
              <span className={styles.routeIcon}>{route.mainImage}</span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span className={styles.routeName}>{route.name}</span>
                <span className={styles.routeLocation}>{route.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.buttonGroup}>
        <Button variant="light" onClick={onClickPrevious}>
          이전
        </Button>
        <Button onClick={onClickNext}>다음</Button>
      </div>
    </div>
  );
};
