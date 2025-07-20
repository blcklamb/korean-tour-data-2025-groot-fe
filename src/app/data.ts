export const mockEcoTourRoutes: {
  id: string;
  name: string;
  location: string;
  region: string;
  description: string;
  detailedDescription: string;
  mainImage: string;
  detailImages: string[];
  carbonRating: "low" | "medium" | "high";
  viewCount: number;
  category: string;
  activities: string[];
  difficulty: "easy" | "medium" | "hard";
  duration: string; // e.g., "2-3시간"
  season: string; // e.g., "봄", "여름", "가을", "겨울", "사계절"
}[] = [
  {
    id: "1",
    name: "문경새재 벚꽃길",
    location: "경북 문경시",
    region: "문경",
    description: "아름다운 벚꽃이 만개하는 역사 깊은 고갯길입니다.",
    detailedDescription:
      "문경새재는 조선시대부터 이어져 온 역사적인 통로로, 매년 4월이면 벚꽃이 만개하여 환상적인 풍경을 자아냅니다. 새재 옛길을 따라 걸으며 자연과 역사를 동시에 느낄 수 있는 특별한 코스입니다.",
    mainImage: "🌸",
    detailImages: ["🌸", "🏔️", "🚶", "📷"],
    carbonRating: "low",
    viewCount: 15420,
    category: "문화유산",
    activities: ["트레킹", "사진촬영", "역사탐방", "자연관찰"],
    difficulty: "easy",
    duration: "2-3시간",
    season: "봄",
  },
  {
    id: "2",
    name: "주왕산 국립공원",
    location: "경북 청송군",
    region: "청송",
    description: "기암절벽과 폭포의 절경을 감상할 수 있는 명산입니다.",
    detailedDescription:
      "주왕산은 대한민국의 12번째 국립공원으로 지정된 곳으로, 기암괴석과 깊은 계곡, 맑은 폭포가 어우러진 천혜의 자연경관을 자랑합니다. 특히 주산지의 왕벚나무와 기암절벽의 조화는 절경 중의 절경입니다.",
    mainImage: "🏔️",
    detailImages: ["🏔️", "💧", "🌲", "🪨"],
    carbonRating: "low",
    viewCount: 23150,
    category: "국립공원",
    activities: ["등산", "폭포감상", "자연관찰", "힐링"],
    difficulty: "medium",
    duration: "4-6시간",
    season: "사계절",
  },
  {
    id: "3",
    name: "안동 하회마을",
    location: "경북 안동시",
    region: "안동",
    description: "전통 한옥과 낙동강이 어우러진 세계문화유산입니다.",
    detailedDescription:
      "안동 하회마을은 600년 전통의 씨족마을로 유네스코 세계문화유산에 등재된 곳입니다. 낙동강이 마을을 휘돌아 흐르는 지형과 조선시대 전통가옥이 그대로 보존되어 있어 한국의 전통문화를 체험할 수 있습니다.",
    mainImage: "🏘️",
    detailImages: ["🏘️", "🏛️", "🌊", "🎭"],
    carbonRating: "low",
    viewCount: 18900,
    category: "문화유산",
    activities: ["문화체험", "전통가옥관람", "탈춤공연관람", "강변산책"],
    difficulty: "easy",
    duration: "3-4시간",
    season: "사계절",
  },
  {
    id: "4",
    name: "경주 불국사·석굴암",
    location: "경북 경주시",
    region: "경주",
    description: "신라 천년의 역사가 살아있는 불교문화 유적지입니다.",
    detailedDescription:
      "불국사와 석굴암은 신라 천년의 불교예술이 집약된 세계문화유산입니다. 토함산 자락에 위치한 이곳은 아름다운 자연경관과 함께 찬란한 신라문화를 경험할 수 있는 특별한 공간입니다.",
    mainImage: "🏯",
    detailImages: ["🏯", "🗿", "🌲", "⛩️"],
    carbonRating: "medium",
    viewCount: 31200,
    category: "문화유산",
    activities: ["문화재관람", "템플스테이", "산책", "명상"],
    difficulty: "easy",
    duration: "2-3시간",
    season: "사계절",
  },
  {
    id: "5",
    name: "울릉도·독도",
    location: "경북 울릉군",
    region: "울릉도",
    description: "신비로운 화산섬의 절경과 우리나라 최동단 영토입니다.",
    detailedDescription:
      "울릉도는 약 250만 년 전 화산활동으로 형성된 화산섬으로, 독특한 지형과 청정한 자연환경을 자랑합니다. 독도와 함께 우리나라 최동단의 영토로서 역사적 의미도 큽니다.",
    mainImage: "🏝️",
    detailImages: ["🏝️", "🌊", "⛰️", "🐟"],
    carbonRating: "high",
    viewCount: 12800,
    category: "해안",
    activities: ["섬투어", "해안산책", "독도관람", "해산물맛보기"],
    difficulty: "medium",
    duration: "1-2일",
    season: "봄·여름·가을",
  },
];
