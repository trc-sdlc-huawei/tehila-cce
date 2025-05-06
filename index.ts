#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';


// src
import {
  GITLAB_PERSONAL_ACCESS_TOKEN,
  createBranch,
  createIssue,
  createMergeRequest, createOrUpdateFile, createRepository, getFileContents, searchProjects,
  forkProject, createCommit
} from './src/gitlab/index.js';
import { HuaweiListClusters , HuaweiGetClusterById, HuaweiListNamespaces, HuaweiDeleteNamespace, HuaweiCreateNamespace, HuaweiListPods, HuaweiCreatePod, HuaweiReadPod } from './src/huawei/index.js';
import { HUAWEI_CCE_AUTH_TOKEN } from './src/huawei/constants.js';
import {
  CreateOrUpdateFileSchema,
  SearchRepositoriesSchema,
  CreateRepositorySchema,
  GetFileContentsSchema,
  PushFilesSchema,
  CreateIssueSchema,
  CreateMergeRequestSchema,
  ForkRepositorySchema,
  CreateBranchSchema,
  HuaweiListClustersParamsSchema,
  HuaweiGetClusterByIdParamsSchema,
  HuaweiListNamespacesParamsSchema,
  HuaweiDeleteNamespaceParamsSchema,
  HuaweiCreateNamespaceParamsSchema,
  HuaweiListPodsParamsSchema,
  HuaweiCreatePodParamsSchema,
  HuaweiReadPodParamsSchema,
} from './schemas/index.js';

const server = new Server({
  name: "gitlab-mcp-server",
  version: "0.5.1",
}, {
  capabilities: {
    tools: {}
  }
});




if (!GITLAB_PERSONAL_ACCESS_TOKEN) {
  console.error("GITLAB_PERSONAL_ACCESS_TOKEN environment variable is not set");
  process.exit(1);
}

if (!HUAWEI_CCE_AUTH_TOKEN) {
  console.error("HUAWEI_CCE_AUTH_TOKEN environment variable is not set");
  process.exit(1);
}



server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      //  gitlab
      {
        name: "create_or_update_file",
        description: "Create or update a single file in a GitLab project",
        inputSchema: zodToJsonSchema(CreateOrUpdateFileSchema)
      },
      {
        name: "search_repositories",
        description: "Search for GitLab projects",
        inputSchema: zodToJsonSchema(SearchRepositoriesSchema)
      },
      {
        name: "create_repository",
        description: "Create a new GitLab project",
        inputSchema: zodToJsonSchema(CreateRepositorySchema)
      },
      {
        name: "get_file_contents",
        description: "Get the contents of a file or directory from a GitLab project",
        inputSchema: zodToJsonSchema(GetFileContentsSchema)
      },
      {
        name: "push_files",
        description: "Push multiple files to a GitLab project in a single commit",
        inputSchema: zodToJsonSchema(PushFilesSchema)
      },
      {
        name: "create_issue",
        description: "Create a new issue in a GitLab project",
        inputSchema: zodToJsonSchema(CreateIssueSchema)
      },
      {
        name: "create_merge_request",
        description: "Create a new merge request in a GitLab project",
        inputSchema: zodToJsonSchema(CreateMergeRequestSchema)
      },
      {
        name: "fork_repository",
        description: "Fork a GitLab project to your account or specified namespace",
        inputSchema: zodToJsonSchema(ForkRepositorySchema)
      },
      {
        name: "create_branch",
        description: "Create a new branch in a GitLab project",
        inputSchema: zodToJsonSchema(CreateBranchSchema)
      },
      // huawei
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

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (!request.params.arguments) {
      throw new Error("Arguments are required");
    }

    switch (request.params.name) {
      case "read_pod": {
        const args = HuaweiReadPodParamsSchema.parse(request.params.arguments);
        const pod = await HuaweiReadPod(args.region, args.cluster_id, args.namespace, args.pod_name, { pretty: args.pretty });
        return { content: [{ type: "text", text: JSON.stringify(pod, null, 2) }] };
      }
      // gitlab
      case "fork_repository": {
        const args = ForkRepositorySchema.parse(request.params.arguments);
        const fork = await forkProject(args.project_id, args.namespace);
        return { content: [{ type: "text", text: JSON.stringify(fork, null, 2) }] };
      }

      case "create_branch": {
        const args = CreateBranchSchema.parse(request.params.arguments);
        let ref = args.ref;
        if (!ref) {
          ref = "HEAD";
        }

        const branch = await createBranch(args.project_id, {
          name: args.branch,
          ref
        });

        return { content: [{ type: "text", text: JSON.stringify(branch, null, 2) }] };
      }

      case "search_repositories": {
        const args = SearchRepositoriesSchema.parse(request.params.arguments);
        const results = await searchProjects(args.search, args.page, args.per_page);
        return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
      }

      case "create_repository": {
        const args = CreateRepositorySchema.parse(request.params.arguments);
        const repository = await createRepository(args);
        return { content: [{ type: "text", text: JSON.stringify(repository, null, 2) }] };
      }

      case "get_file_contents": {
        const args = GetFileContentsSchema.parse(request.params.arguments);
        const contents = await getFileContents(args.project_id, args.file_path, args.ref);
        return { content: [{ type: "text", text: JSON.stringify(contents, null, 2) }] };
      }

      case "create_or_update_file": {
        const args = CreateOrUpdateFileSchema.parse(request.params.arguments);
        const result = await createOrUpdateFile(
          args.project_id,
          args.file_path,
          args.content,
          args.commit_message,
          args.branch,
          args.previous_path
        );
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }

      case "push_files": {
        const args = PushFilesSchema.parse(request.params.arguments);
        const result = await createCommit(
          args.project_id,
          args.commit_message,
          args.branch,
          args.files.map(f => ({ path: f.file_path, content: f.content }))
        );
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }

      case "create_issue": {
        const args = CreateIssueSchema.parse(request.params.arguments);
        const { project_id, ...options } = args;
        const issue = await createIssue(project_id, options);
        return { content: [{ type: "text", text: JSON.stringify(issue, null, 2) }] };
      }

      case "create_merge_request": {
        const args = CreateMergeRequestSchema.parse(request.params.arguments);
        const { project_id, ...options } = args;
        const mergeRequest = await createMergeRequest(project_id, options);
        return { content: [{ type: "text", text: JSON.stringify(mergeRequest, null, 2) }] };
      }

      // huawei
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
      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid arguments: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    throw error;
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("GitLab MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});