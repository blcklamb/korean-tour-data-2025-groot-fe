import z from "zod";

const carbonCalculatorSchema = z.object({
  sessionId: z.uuid(),
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
      accommodationTypeId: z.number(),
      checkInDate: z.date(),
      checkOutDate: z.date(),
    })
  ),
});

type CarbonCalculatorFormData = z.infer<typeof carbonCalculatorSchema>;

export type { CarbonCalculatorFormData };
export { carbonCalculatorSchema };
