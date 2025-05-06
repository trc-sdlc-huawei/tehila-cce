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