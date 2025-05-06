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

export const HuaweiPodSchema = z.object({
  metadata: z.any(),
  spec: z.any(),
  status: z.any(),
});
export type HuaweiPod = z.infer<typeof HuaweiPodSchema>;

export const HuaweiListPodsResponseSchema = z.object({
  kind: z.literal('PodList'),
  apiVersion: z.string(),
  metadata: z.any(),
  items: z.array(HuaweiPodSchema),
});
export type HuaweiListPodsResponse = z.infer<typeof HuaweiListPodsResponseSchema>;

export const HuaweiNamespaceSchema = z.object({
  metadata: z.any(),
  spec: z.any(),
  status: z.any(),
});
export type HuaweiNamespace = z.infer<typeof HuaweiNamespaceSchema>;

export const HuaweiListNamespacesResponseSchema = z.object({
  kind: z.literal('NamespaceList'),
  apiVersion: z.string(),
  metadata: z.any(),
  items: z.array(HuaweiNamespaceSchema),
});
export type HuaweiListNamespacesResponse = z.infer<typeof HuaweiListNamespacesResponseSchema>;