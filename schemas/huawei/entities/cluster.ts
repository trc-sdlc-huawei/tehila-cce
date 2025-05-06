import { z } from 'zod';

export const HuaweiClusterMetadataSchema = z.object({
  name: z.string(),
  uid: z.string(),
  creationTimestamp: z.string(),
  updateTimestamp: z.string(),
  labels: z.record(z.string()),
  annotations: z.record(z.string()),
  alias: z.string(),
  timezone: z.string(),
  ownerReferences: z.record(z.any())
});

export const HuaweiClusterSpecSchema = z.object({
  publicAccess: z.object({
    cidrs: z.array(z.string())
  }),
  category: z.string(),
  type: z.string(),
  enableAutopilot: z.boolean(),
  maintenanceWindow: z.any().nullable(),
  flavor: z.string(),
  version: z.string(),
  platformVersion: z.string(),
  legacyVersion: z.string(),
  hostNetwork: z.object({
    vpc: z.string(),
    subnet: z.string(),
    SecurityGroup: z.string(),
    controlPlaneSecurityGroup: z.string()
  }),
  containerNetwork: z.object({
    mode: z.string(),
    cidr: z.string()
  }),
  eniNetwork: z.record(z.any()),
  serviceNetwork: z.object({
    IPv4CIDR: z.string()
  }),
  clusterOps: z.record(z.any()),
  authentication: z.object({
    mode: z.string(),
    authenticatingProxy: z.record(z.any())
  }),
  billingMode: z.number(),
  masters: z.array(z.object({
    availabilityZone: z.string()
  })),
  kubernetesSvcIpRange: z.string(),
  kubeProxyMode: z.string(),
  az: z.string(),
  extendParam: z.record(z.string()),
  supportIstio: z.boolean(),
  encryptionConfig: z.object({
    mode: z.string()
  }),
  deletionProtection: z.boolean()
});

export const HuaweiClusterStatusSchema = z.object({
  phase: z.string(),
  endpoints: z.array(z.object({
    url: z.string(),
    type: z.string()
  }))
});

export const HuaweiClusterSchema = z.object({
  kind: z.literal('Cluster'),
  apiVersion: z.string(),
  metadata: HuaweiClusterMetadataSchema,
  spec: HuaweiClusterSpecSchema,
  status: HuaweiClusterStatusSchema
});

export type HuaweiCluster = z.infer<typeof HuaweiClusterSchema>;
