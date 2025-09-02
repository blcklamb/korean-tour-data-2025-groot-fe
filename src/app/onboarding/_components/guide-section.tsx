"use client";

import {
  IconTarget,
  IconMapPin,
  IconCamera,
  IconAward,
} from "@tabler/icons-react";
import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";

const ONBOARDING_STEPS = [
  {
    step: 1,
    title: "미션을 선택하세요",
    description:
      "일상 속 친환경 행동 미션 중에서\n원하는 미션을 선택해보세요.\n텀블러 사용, 자전거 타기 등\n다양한 미션이 준비되어 있어요.",
    icon: <IconTarget width={24} height={24} />,
  },
  {
    step: 2,
    title: "위치를 인증하세요",
    description:
      "GPS를 통해 현재 위치를\n인증해주세요.\n미션을 수행하는 장소가\n정확히 기록됩니다.",
    icon: <IconMapPin width={24} height={24} />,
  },
  {
    step: 3,
    title: "미션을 수행하고 인증하세요",
    description:
      "미션을 실제로 수행한 후\n인증 사진과 후기를 올려주세요.\n최대 3장의 사진과 500자의\n후기를 작성할 수 있어요.",
    icon: <IconCamera width={24} height={24} />,
  },
  {
    step: 4,
    title: "결과를 확인하고 공유하세요",
    description:
      "탄소절감량을 확인하고\n새로운 뱃지를 획득해보세요.\nSNS에 공유해서 친구들과\n함께 환경보호에 동참하세요.",
    icon: <IconAward width={24} height={24} />,
  },
];

export function GuideSection() {
  const router = useRouter();
  return (
    <div className="min-h-screen p-4">
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-green-200"></div>

        {ONBOARDING_STEPS.map((_step) => {
          return (
            <div key={_step.step} className="relative flex items-start mb-8">
              {/* 스텝 번호와 아이콘 */}
              <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-green-100 border-2 border-green-300 rounded-full mr-4">
                <div className="text-green-600">{_step.icon}</div>
              </div>

              {/* 스텝 내용 */}
              <div className="flex-1 bg-white rounded-lg p-4 shadow-sm">
                <div className="mb-2">
                  <span className="text-sm text-green-600 font-semibold">
                    Step {_step.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-800">
                  {_step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {_step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <Button onClick={() => router.push("/")}>시작하기</Button>
    </div>
  );
}
