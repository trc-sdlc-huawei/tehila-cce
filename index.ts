#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';


// src

import {
  HuaweiListClusters,
  HuaweiGetClusterById,
  HuaweiListNamespaces,
  HuaweiDeleteNamespace,
  HuaweiCreateNamespace,
  HuaweiListPods,
  HuaweiCreatePod,
  HuaweiReadPod,
  HuaweiGetNamespaceByName,
  HuaweiDeletePod
} from './src/huawei/index.js';
import { HUAWEI_CCE_AUTH_TOKEN } from './src/huawei/constants.js';
import {
  HuaweiListClustersParamsSchema,
  HuaweiGetClusterByIdParamsSchema,
  HuaweiListNamespacesParamsSchema,
  HuaweiDeleteNamespaceParamsSchema,
  HuaweiCreateNamespaceParamsSchema,
  HuaweiListPodsParamsSchema,
  HuaweiCreatePodParamsSchema,
  HuaweiReadPodParamsSchema,
  HuaweiGetNamespaceByNameParamsSchema,
  HuaweiDeletePodParamsSchema,
} from './schemas/index.js';

const server = new Server({
  name: "huawei-cce-mcp-server",
  version: "0.5.1",
}, {
  capabilities: {
    tools: {}
  }
});



if (!HUAWEI_CCE_AUTH_TOKEN) {
  console.error("HUAWEI_CCE_AUTH_TOKEN environment variable is not set");
  process.exit(1);
}


// set up request handler for list tools, for each show name, description and input schema
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_namespace_by_name",
        description: "Get a namespace in a Huawei CCE cluster by name",
        inputSchema: zodToJsonSchema(HuaweiGetNamespaceByNameParamsSchema)
      },
      {
        name: "delete_pod",
        description: "Delete a pod by name and namespace in a Huawei CCE cluster",
        inputSchema: zodToJsonSchema(HuaweiDeletePodParamsSchema)
      },
      {
        name: "list_clusters",
        description: "List all clusters in a Huawei CCE project",
        inputSchema: zodToJsonSchema(HuaweiListClustersParamsSchema)
      },
      {
        name: "get_cluster_by_id",
        description: "Get a specific cluster by ID",
        inputSchema: zodToJsonSchema(HuaweiGetClusterByIdParamsSchema)
      },
      {
        name: "list_namespaces",
        description: "List all namespaces in a Huawei CCE cluster",
        inputSchema: zodToJsonSchema(HuaweiListNamespacesParamsSchema)
      },
      {
        name: "delete_namespace",
        description: "Delete a namespace in a Huawei CCE cluster",
        inputSchema: zodToJsonSchema(HuaweiDeleteNamespaceParamsSchema)
      },
      {
        name: "create_namespace",
        description: "Create a namespace in a Huawei CCE cluster",
        inputSchema: zodToJsonSchema(HuaweiCreateNamespaceParamsSchema)
      },
      {
        name: "list_pods",
        description: "List all pods in a Huawei CCE cluster",
        inputSchema: zodToJsonSchema(HuaweiListPodsParamsSchema)
      },
      {
        name: "create_pod",
        description: "Create a pod in a Huawei CCE cluster",
        inputSchema: zodToJsonSchema(HuaweiCreatePodParamsSchema)
      },
      {
        name: "read_pod",
        description: "Read a specific pod in a Huawei CCE cluster",
        inputSchema: zodToJsonSchema(HuaweiReadPodParamsSchema)
      },
    ]
  };
});

// set up request handler for call tool, based on tool name, parse arguments with paramsSchema,
// call the corresponding function, and return uniform response
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (!request.params.arguments) {
      throw new Error("Arguments are required");
    }

    switch (request.params.name) {
      case "delete_pod": {
        const args = HuaweiDeletePodParamsSchema.parse(request.params.arguments);
        const pod = await HuaweiDeletePod(args.region, args.cluster_id, args.namespace, args.pod_name);
        return { content: [{ type: "text", text: JSON.stringify(pod, null, 2) }] };
      }
      case "get_namespace_by_name": {
        const args = HuaweiGetNamespaceByNameParamsSchema.parse(request.params.arguments);
        const ns = await HuaweiGetNamespaceByName(args.region, args.cluster_id, args.namespace);
        return { content: [{ type: "text", text: JSON.stringify(ns, null, 2) }] };
      }
      case "list_clusters": {
        const args = HuaweiListClustersParamsSchema.parse(request.params.arguments);
        const clusters = await HuaweiListClusters(args.region, args.project_id);
        return { content: [{ type: "text", text: JSON.stringify(clusters, null, 2) }] };
      }
      case "get_cluster_by_id": {
        const args = HuaweiGetClusterByIdParamsSchema.parse(request.params.arguments);
        const cluster = await HuaweiGetClusterById(args.region, args.project_id, args.cluster_id);
        return { content: [{ type: "text", text: JSON.stringify(cluster, null, 2) }] };
      }
      case "list_namespaces": {
        const args = HuaweiListNamespacesParamsSchema.parse(request.params.arguments);
        const namespaces = await HuaweiListNamespaces(args.region, args.cluster_id);
        return { content: [{ type: "text", text: JSON.stringify(namespaces, null, 2) }] };
      }
      case "delete_namespace": {
        const args = HuaweiDeleteNamespaceParamsSchema.parse(request.params.arguments);
        const { region, cluster_id, name, ...opts } = args;
        const result = await HuaweiDeleteNamespace(region, cluster_id, name, opts);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "create_namespace": {
        const args = HuaweiCreateNamespaceParamsSchema.parse(request.params.arguments);
        const body = {
          apiVersion: "v1",
          kind: "Namespace",
          metadata: {
            name: args.name,
            labels: args.labels,
            annotations: args.annotations
          }
        };
        const { region, cluster_id, ...opts } = args;
        delete opts.labels;
        delete opts.annotations;
        const result = await HuaweiCreateNamespace(region, cluster_id, body, opts);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }

      case "list_pods": {
        const args = HuaweiListPodsParamsSchema.parse(request.params.arguments);
        const { region, cluster_id, ...opts } = args;
        const pods = await HuaweiListPods(region, cluster_id, opts);
        return { content: [{ type: "text", text: JSON.stringify(pods, null, 2) }] };
      }
      case "create_pod": {
        const args = HuaweiCreatePodParamsSchema.parse(request.params.arguments);
        const { region, cluster_id, namespace, pod_name, container_name, image, ...opts } = args;
        const result = await HuaweiCreatePod(region, cluster_id, namespace, pod_name, container_name, image, opts);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "read_pod": {
        const args = HuaweiReadPodParamsSchema.parse(request.params.arguments);
        const pod = await HuaweiReadPod(args.region, args.cluster_id, args.namespace, args.pod_name, { pretty: args.pretty });
        return { content: [{ type: "text", text: JSON.stringify(pod, null, 2) }] };
      }
      // error in case of unknown tool name
      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  } catch (error) {
    // catch parsing errors
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid arguments: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    // catch other errors
    throw error;
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Huawei CCE MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});