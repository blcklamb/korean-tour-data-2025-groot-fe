import z from "zod";

const missionSchema = z.object({
  content: z.string().min(5, "활동 내용은 최소 5자 이상이어야 합니다."),
  latitude: z.number().min(-90, "유효한 위도 형식이 아닙니다.").max(90),
  longitude: z.number().min(-180, "유효한 경도 형식이 아닙니다.").max(180),
  sigunguId: z.string().optional(),
  files: z
    .array(z.instanceof(File))
    .max(3, "최대 3장의 사진만 업로드할 수 있습니다.")
    .optional(),
});
type MissionFormData = z.infer<typeof missionSchema>;

export type { MissionFormData };
export { missionSchema };
