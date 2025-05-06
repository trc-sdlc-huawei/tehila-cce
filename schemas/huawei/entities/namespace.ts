import { z } from 'zod'

export const HuaweiNamespaceSchema = z.object({
    metadata: z.any(),
    spec: z.any(),
    status: z.any(),
});


export type HuaweiNamespace = z.infer<typeof HuaweiNamespaceSchema>;