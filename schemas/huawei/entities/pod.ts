import { z } from 'zod'

export const HuaweiPodSchema = z.object({
  kind: z.literal('Pod').optional(),
  apiVersion: z.string().optional(),
  metadata: z.any(),
  spec: z.any(),
  status: z.any(),
});


export type HuaweiPod = z.infer<typeof HuaweiPodSchema>;
