#!/usr/bin/env node

import { InMemoryEventStore } from '@modelcontextprotocol/sdk/examples/shared/inMemoryEventStore.js';
import { randomUUID } from 'node:crypto';
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
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
  HuaweiDeletePod,
  HuaweiListPodsByNamespace,
  HuaweiDeletePodsByNamespace
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
  HuaweiListPodsByNamespaceParamsSchema,
  HuaweiDeletePodsByNamespaceParamsSchema,
} from './schemas/index.js';
import express, { Request, Response } from "express";

const server = new Server({
  name: "huawei-cce-mcp-server",
  version: "0.5.1",
}, {
  capabilities: {
    tools: {},
    resources: {}
  }
});
logInfo("Huawei CCE MCP Server running on stdio");
logInfo(process.pid.toString());
import dotenv from 'dotenv';
import { logInfo } from "./utils/logs.js";
logInfo(process.cwd());
// dotenv.config();
logInfo(process.env.HUAWEI_CCE_AUTH_TOKEN?.toString() || "HUAWEI_CCE_AUTH_TOKEN environment variable is not set");
if (!HUAWEI_CCE_AUTH_TOKEN) {
  console.error("HUAWEI_CCE_AUTH_TOKEN environment ssssssss variable is not set");
  process.exit(1);
}


// set up request handler for list tools, for each show name, description and input schema
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // Cluster tools
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

      // Namespace tools
      {
        name: "list_namespaces",
        description: "List all namespaces in a Huawei CCE cluster",
        inputSchema: zodToJsonSchema(HuaweiListNamespacesParamsSchema)
      },
      {
        name: "get_namespace_by_name",
        description: "Get a namespace in a Huawei CCE cluster by name",
        inputSchema: zodToJsonSchema(HuaweiGetNamespaceByNameParamsSchema)
      },
      {
        name: "create_namespace",
        description: "Create a namespace in a Huawei CCE cluster",
        inputSchema: zodToJsonSchema(HuaweiCreateNamespaceParamsSchema)
      },
      {
        name: "delete_namespace",
        description: "Delete a namespace in a Huawei CCE cluster",
        inputSchema: zodToJsonSchema(HuaweiDeleteNamespaceParamsSchema)
      },

      // Pod tools
      {
        name: "list_pods",
        description: "List all pods in a Huawei CCE cluster",
        inputSchema: zodToJsonSchema(HuaweiListPodsParamsSchema)
      },
      {
        name: "list_pods_by_namespace",
        description: "List all pods in a namespace in a Huawei CCE cluster",
        inputSchema: zodToJsonSchema(HuaweiListPodsByNamespaceParamsSchema)
      },
      {
        name: "get_pod_by_name_and_namespace",
        description: "Get a specific pod in a Huawei CCE cluster by name and namespace",
        inputSchema: zodToJsonSchema(HuaweiReadPodParamsSchema)
      },
      {
        name: "create_pod",
        description: "Create a pod in a Huawei CCE cluster",
        inputSchema: zodToJsonSchema(HuaweiCreatePodParamsSchema)
      },
      {
        name: "delete_pod",
        description: "Delete a pod by name and namespace in a Huawei CCE cluster",
        inputSchema: zodToJsonSchema(HuaweiDeletePodParamsSchema)
      },
      {
        name: "delete_pods_by_namespace",
        description: "Delete all pods in a namespace in a Huawei CCE cluster",
        inputSchema: zodToJsonSchema(HuaweiDeletePodsByNamespaceParamsSchema)
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
      // Cluster tools
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

      // Namespace tools
      case "list_namespaces": {
        const args = HuaweiListNamespacesParamsSchema.parse(request.params.arguments);
        const namespaces = await HuaweiListNamespaces(args.region, args.cluster_id);
        return { content: [{ type: "text", text: JSON.stringify(namespaces, null, 2) }] };
      }
      case "get_namespace_by_name": {
        const args = HuaweiGetNamespaceByNameParamsSchema.parse(request.params.arguments);
        const ns = await HuaweiGetNamespaceByName(args.region, args.cluster_id, args.name);
        return { content: [{ type: "text", text: JSON.stringify(ns, null, 2) }] };
      }
      case "create_namespace": {
        const args = HuaweiCreateNamespaceParamsSchema.parse(request.params.arguments);
        const body = {
          apiVersion: "v1",
          kind: "Namespace",
          metadata: {
            name: args.name,
          }
        };
        const { region, cluster_id } = args;
        const result = await HuaweiCreateNamespace(region, cluster_id, body);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "delete_namespace": {
        const args = HuaweiDeleteNamespaceParamsSchema.parse(request.params.arguments);
        const { region, cluster_id, name } = args;
        const result = await HuaweiDeleteNamespace(region, cluster_id, name);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }

      // Pod tools
      case "list_pods": {
        const args = HuaweiListPodsParamsSchema.parse(request.params.arguments);
        const { region, cluster_id } = args;
        const pods = await HuaweiListPods(region, cluster_id);
        return { content: [{ type: "text", text: JSON.stringify(pods, null, 2) }] };
      }
      case "create_pod": {
        const args = HuaweiCreatePodParamsSchema.parse(request.params.arguments);
        const { region, cluster_id, namespace, pod_name, container_name, image } = args;
        const result = await HuaweiCreatePod(region, cluster_id, namespace, pod_name, container_name, image);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "get_pod_by_name_and_namespace": {
        const args = HuaweiReadPodParamsSchema.parse(request.params.arguments);
        const pod = await HuaweiReadPod(args.region, args.cluster_id, args.namespace, args.pod_name);
        return { content: [{ type: "text", text: JSON.stringify(pod, null, 2) }] };
      }
      case "list_pods_by_namespace": {
        const args = HuaweiListPodsByNamespaceParamsSchema.parse(request.params.arguments);
        const pods = await HuaweiListPodsByNamespace(args.region, args.cluster_id, args.namespace);
        return { content: [{ type: "text", text: JSON.stringify(pods, null, 2) }] };
      }
      case "delete_pod": {
        const args = HuaweiDeletePodParamsSchema.parse(request.params.arguments);
        const pod = await HuaweiDeletePod(args.region, args.cluster_id, args.namespace, args.pod_name);
        return { content: [{ type: "text", text: JSON.stringify(pod, null, 2) }] };
      }
      case "delete_pods_by_namespace": {
        const args = HuaweiDeletePodsByNamespaceParamsSchema.parse(request.params.arguments);
        const podList = await HuaweiDeletePodsByNamespace(args.region, args.cluster_id, args.namespace);
        return { content: [{ type: "text", text: JSON.stringify(podList, null, 2) }] };
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


// set up request handler to list resources
// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "file:///logs/app.log",
        name: "Application Logs",
        mimeType: "text/plain"
      }
    ]
  };
});


// Read resource contents
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  if (uri === "file:///logs/app.log") {
    // const logContents = await readLogFile();
    const logContents = "fdafdafds"
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: logContents
        }
      ]
    };
  }

  throw new Error("Resource not found");
});




// Parse CLI arguments to select mode
const mode = process.argv[2] === 'streamableHttp' ? 'streamableHttp' : 'stdio';
// run stdio server
async function runServer() {
  logInfo("Huawei CCE MCP Server running in stdio mode");
  dotenv.config();
  const transport = new StdioServerTransport();
  console.error("Huawei CCE MCP Server running in stdio mode");
  await server.connect(transport);
}

if (mode === 'stdio') {
  runServer().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
  });
} else if (mode === 'streamableHttp') {
  // run streamable http server
  const app = express();
  const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

  app.post('/mcp', async (req: Request, res: Response) => {
    console.log('Received MCP POST request');
    try {
      // Check for existing session ID
      const sessionId = req.headers['mcp-session-id'] as string | undefined;
      let transport: StreamableHTTPServerTransport;

      if (sessionId && transports[sessionId]) {
        // Reuse existing transport
        transport = transports[sessionId];
      } else if (!sessionId) {
        // New initialization request
        const eventStore = new InMemoryEventStore();
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          eventStore, // Enable resumability
          onsessioninitialized: (sessionId: string) => {
            // Store the transport by session ID when session is initialized
            // This avoids race conditions where requests might come in before the session is stored
            console.log(`Session initialized with ID: ${sessionId}`);
            transports[sessionId] = transport;
          }
        });

        // Set up onclose handler to clean up transport when closed
        transport.onclose = () => {
          const sid = transport.sessionId;
          if (sid && transports[sid]) {
            console.log(`Transport closed for session ${sid}, removing from transports map`);
            delete transports[sid];
          }
        };

        // Connect the transport to the MCP server BEFORE handling the request
        // so responses can flow back through the same transport
        await server.connect(transport);

        await transport.handleRequest(req, res);
        return; // Already handled
      } else {
        // Invalid request - no session ID or not initialization request
        res.status(400).json({
          jsonrpc: '2.0',
          error: {
            code: -32000,
            message: 'Bad Request: No valid session ID provided',
          },
          id: req?.body?.id,
        });
        return;
      }

      // Handle the request with existing transport - no need to reconnect
      // The existing transport is already connected to the server
      await transport.handleRequest(req, res);
    } catch (error) {
      console.error('Error handling MCP request:', error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: 'Internal server error',
          },
          id: req?.body?.id,
        });
        return;
      }
    }
  });

  // Handle GET requests for SSE streams (using built-in support from StreamableHTTP)
  app.get('/mcp', async (req: Request, res: Response) => {
    console.log('Received MCP GET request');
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    if (!sessionId || !transports[sessionId]) {
      res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: No valid session ID provided',
        },
        id: req?.body?.id,
      });
      return;
    }

    // Check for Last-Event-ID header for resumability
    const lastEventId = req.headers['last-event-id'] as string | undefined;
    if (lastEventId) {
      console.log(`Client reconnecting with Last-Event-ID: ${lastEventId}`);
    } else {
      console.log(`Establishing new SSE stream for session ${sessionId}`);
    }

    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
  });

  // Handle DELETE requests for session termination (according to MCP spec)
  app.delete('/mcp', async (req: Request, res: Response) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    if (!sessionId || !transports[sessionId]) {
      res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: No valid session ID provided',
        },
        id: req?.body?.id,
      });
      return;
    }

    console.log(`Received session termination request for session ${sessionId}`);

    try {
      const transport = transports[sessionId];
      await transport.handleRequest(req, res);
    } catch (error) {
      console.error('Error handling session termination:', error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: 'Error handling session termination',
          },
          id: req?.body?.id,
        });
        return;
      }
    }
  });

  // Start the server
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`MCP Streamable HTTP Server listening on port ${PORT}`);
  });

  // Handle server shutdown
  process.on('SIGINT', async () => {
    console.log('Shutting down server...');

    // Close all active transports to properly clean up resources
    for (const sessionId in transports) {
      try {
        console.log(`Closing transport for session ${sessionId}`);
        await transports[sessionId].close();
        delete transports[sessionId];
      } catch (error) {
        console.error(`Error closing transport for session ${sessionId}:`, error);
      }
    }
    await server.close();
    console.log('Server shutdown complete');
    process.exit(0);
  });
}
