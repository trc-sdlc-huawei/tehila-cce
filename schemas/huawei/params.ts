import { z } from 'zod';

export const HuaweiListClustersParamsSchema = z.object({
  region: z.string().describe('Region to list clusters in'),
  project_id: z.string().describe('Project ID to list clusters for')
});

export type HuaweiListClustersParams = z.infer<typeof HuaweiListClustersParamsSchema>;

export const HuaweiGetClusterByIdParamsSchema = z.object({
  region: z.string().describe('Region of the cluster'),
  project_id: z.string().describe('Project ID'),
  cluster_id: z.string().describe('Cluster ID'),
});

export type HuaweiGetClusterByIdParams = z.infer<typeof HuaweiGetClusterByIdParamsSchema>;

export const HuaweiListNamespacesParamsSchema = z.object({
  region: z.string().describe('Region'),
  cluster_id: z.string().describe('Cluster ID'),
});
export type HuaweiListNamespacesParams = z.infer<typeof HuaweiListNamespacesParamsSchema>;

export const HuaweiDeleteNamespaceParamsSchema = z.object({
  region: z.string().describe('Region'),
  cluster_id: z.string().describe('Cluster ID'),
  name: z.string().describe('Namespace name'),
  dryRun: z.string().optional(),
  gracePeriodSeconds: z.number().optional(),
  ignoreStoreReadErrorWithClusterBreakingPotential: z.boolean().optional(),
  pretty: z.string().optional(),
  propagationPolicy: z.string().optional(),
});
export type HuaweiDeleteNamespaceParams = z.infer<typeof HuaweiDeleteNamespaceParamsSchema>;

export const HuaweiListPodsParamsSchema = z.object({
  region: z.string().describe('Region'),
  cluster_id: z.string().describe('Cluster ID'),
  labelSelector: z.string().optional(),
  fieldSelector: z.string().optional(),
  limit: z.number().optional(),
  continue: z.string().optional(),
  pretty: z.string().optional(),
});
export type HuaweiListPodsParams = z.infer<typeof HuaweiListPodsParamsSchema>;

export const HuaweiCreatePodParamsSchema = z.object({
  region: z.string().describe('Region'),
  cluster_id: z.string().describe('Cluster ID'),
  namespace: z.string().describe('Namespace'),
  pod_name: z.string().describe('Pod name'),
  container_name: z.string().describe('Container name'),
  image: z.string().describe('Container image'),
  dryRun: z.string().optional(),
  fieldManager: z.string().optional(),
  fieldValidation: z.string().optional(),
  pretty: z.string().optional(),
});
export type HuaweiCreatePodParams = z.infer<typeof HuaweiCreatePodParamsSchema>;

export const HuaweiReadPodParamsSchema = z.object({
  region: z.string().describe('Region'),
  cluster_id: z.string().describe('Cluster ID'),
  namespace: z.string().describe('Namespace'),
  pod_name: z.string().describe('Pod name'),
  pretty: z.string().optional().describe('Pretty print response'),
});
export type HuaweiReadPodParams = z.infer<typeof HuaweiReadPodParamsSchema>;

export const HuaweiCreateNamespaceParamsSchema = z.object({
  region: z.string().describe('Region'),
  cluster_id: z.string().describe('Cluster ID'),
  // Accept either a full manifest or individual params
  name: z.string().describe('Namespace name'),
  labels: z.record(z.string()).optional().describe('Labels'),
  annotations: z.record(z.string()).optional().describe('Annotations'),
  dryRun: z.string().optional(),
  fieldManager: z.string().optional(),
  fieldValidation: z.string().optional(),
  pretty: z.string().optional(),
});
export type HuaweiCreateNamespaceParams = z.infer<typeof HuaweiCreateNamespaceParamsSchema>;