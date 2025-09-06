export const mockEcoTourRoutes: {
  id: number;
  value: string;
  title: string;
  label: string;
  thumbnailUrl: string;
  areaName: string;
  sigunguName: string;
  viewCount: number;
}[] = [
  {
    id: 1,
    value: "1",
    title: "문경새재 벚꽃길",
    label: "문경새재 벚꽃길",
    thumbnailUrl: "🌸",
    areaName: "경상북도",
    sigunguName: "문경시",
    viewCount: 15420,
  },
  {
    id: 2,
    value: "2",
    title: "주왕산 국립공원",
    label: "주왕산 국립공원",
    thumbnailUrl: "🏔️",
    areaName: "경상북도",
    sigunguName: "청송군",
    viewCount: 23150,
  },
  {
    id: 3,
    value: "3",
    title: "안동 하회마을",
    label: "안동 하회마을",
    thumbnailUrl: "🏘️",
    areaName: "경상북도",
    sigunguName: "안동시",
    viewCount: 18900,
  },
  {
    id: 4,
    value: "4",
    title: "경주 불국사·석굴암",
    label: "경주 불국사·석굴암",
    thumbnailUrl: "🏯",
    areaName: "경상북도",
    sigunguName: "경주시",
    viewCount: 31200,
  },
  {
    id: 5,
    value: "5",
    title: "울릉도·독도",
    label: "울릉도·독도",
    thumbnailUrl: "🏝️",
    areaName: "경상북도",
    sigunguName: "울릉군",
    viewCount: 12800,
  },
];

export const mockTransportOptions = [
  { id: 1, value: "walking", icon: "🚶", label: "도보" },
  { id: 2, value: "bicycle", icon: "🚴", label: "자전거" },
  { id: 3, value: "motorcycle", icon: "🏍️", label: "오토바이" },
  { id: 4, value: "subway", icon: "🚇", label: "지하철" },
  { id: 5, value: "ktx", icon: "🚄", label: "기차 (KTX)" },
  { id: 6, value: "train", icon: "🚆", label: "기차 (일반)" },
  { id: 7, value: "bus", icon: "🚌", label: "버스" },
  { id: 8, value: "car_gas", icon: "🚗", label: "승용차 (내연기관)" },
  { id: 9, value: "car_hybrid", icon: "🚙", label: "승용차 (하이브리드)" },
  { id: 10, value: "car_electric", icon: "⚡", label: "승용차 (전기차)" },
  { id: 11, value: "airplane", icon: "✈️", label: "비행기" },
  { id: 12, value: "ship", icon: "🚢", label: "여객선" },
];
