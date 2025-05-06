import { z } from 'zod';
import { HuaweiClusterSchema } from './entities/cluster.js';

export const HuaweiListClustersResponseSchema = z.object({
    kind: z.literal('Cluster'),
    apiVersion: z.string(),
    items: z.array(HuaweiClusterSchema)
});

export type HuaweiListClustersResponse = z.infer<typeof HuaweiListClustersResponseSchema>;

export const HuaweiGetClusterByIdResponseSchema = HuaweiClusterSchema;
export type HuaweiGetClusterByIdResponse = z.infer<typeof HuaweiGetClusterByIdResponseSchema>;