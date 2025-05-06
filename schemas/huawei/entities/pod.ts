import { z } from 'zod'

export const HuaweiPodSchema = z.object({
  metadata: z.any(),
  spec: z.any(),
  status: z.any(),
});


export type HuaweiPod = z.infer<typeof HuaweiPodSchema>;
