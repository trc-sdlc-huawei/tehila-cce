import { z } from 'zod';

// cluster
export const HuaweiListClustersParamsSchema = z.object({
  region: z.string().describe('Region to list clusters in'),
  project_id: z.string().describe('Project ID to list clusters for')
});

export type HuaweiListClustersParams = z.infer<typeof HuaweiListClustersParamsSchema>;

export const HuaweiGetClusterByIdParamsSchema = z.object({
  region: z.string().describe('Region of the cluster'),
  project_id: z.string().describe('Project ID'),
  cluster_id: z.string().describe('Cluster ID')
});

export type HuaweiGetClusterByIdParams = z.infer<typeof HuaweiGetClusterByIdParamsSchema>;


// namespace
export const HuaweiListNamespacesParamsSchema = z.object({
  region: z.string().describe('Region'),
  cluster_id: z.string().describe('Cluster ID')
});
export type HuaweiListNamespacesParams = z.infer<typeof HuaweiListNamespacesParamsSchema>;

export const HuaweiGetNamespaceByNameParamsSchema = z.object({
  region: z.string().describe('Region'),
  cluster_id: z.string().describe('Cluster ID'),
  name: z.string().describe('name')
});
export type HuaweiGetNamespaceByNameParams = z.infer<typeof HuaweiGetNamespaceByNameParamsSchema>;


export const HuaweiDeleteNamespaceParamsSchema = z.object({
  region: z.string().describe('Region'),
  cluster_id: z.string().describe('Cluster ID'),
  name: z.string().describe('name')
});
export type HuaweiDeleteNamespaceParams = z.infer<typeof HuaweiDeleteNamespaceParamsSchema>;

export const HuaweiDeletePodParamsSchema = z.object({
  region: z.string().describe('Region'),
  cluster_id: z.string().describe('Cluster ID'),
  namespace: z.string().describe('Namespace'),
  pod_name: z.string().describe('Pod name'),
});
export type HuaweiDeletePodParams = z.infer<typeof HuaweiDeletePodParamsSchema>;


// pod
export const HuaweiListPodsParamsSchema = z.object({
  region: z.string().describe('Region'),
  cluster_id: z.string().describe('Cluster ID'),
});
export type HuaweiListPodsParams = z.infer<typeof HuaweiListPodsParamsSchema>;

export const HuaweiListPodsByNamespaceParamsSchema = z.object({
  region: z.string().describe('Region'),
  cluster_id: z.string().describe('Cluster ID'),
  namespace: z.string().describe('Namespace'),
});
export type HuaweiListPodsByNamespaceParams = z.infer<typeof HuaweiListPodsByNamespaceParamsSchema>;

export const HuaweiDeletePodsByNamespaceParamsSchema = z.object({
  region: z.string().describe('Region'),
  cluster_id: z.string().describe('Cluster ID'),
  namespace: z.string().describe('Namespace'),
});
export type HuaweiDeletePodsByNamespaceParams = z.infer<typeof HuaweiDeletePodsByNamespaceParamsSchema>;

export const HuaweiCreatePodParamsSchema = z.object({
  region: z.string().describe('Region'),
  cluster_id: z.string().describe('Cluster ID'),
  namespace: z.string().describe('Namespace'),
  pod_name: z.string().describe('Pod name'),
  container_name: z.string().describe('Container name'),
  image: z.string().describe('Container image'),
});
export type HuaweiCreatePodParams = z.infer<typeof HuaweiCreatePodParamsSchema>;

export const HuaweiReadPodParamsSchema = z.object({
  region: z.string().describe('Region'),
  cluster_id: z.string().describe('Cluster ID'),
  namespace: z.string().describe('Namespace'),
  pod_name: z.string().describe('Pod name'),
});
export type HuaweiReadPodParams = z.infer<typeof HuaweiReadPodParamsSchema>;

export const HuaweiCreateNamespaceParamsSchema = z.object({
  region: z.string().describe('Region'),
  cluster_id: z.string().describe('Cluster ID'),
  name: z.string().describe('name'),

});
export type HuaweiCreateNamespaceParams = z.infer<typeof HuaweiCreateNamespaceParamsSchema>;