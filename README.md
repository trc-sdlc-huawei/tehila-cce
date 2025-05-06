# Available Huawei Cloud Tools

## Proprietary CCE APIs

### Cluster-related APIs
- **list_clusters**: List all clusters in a Huawei CCE project.
- **get_cluster_by_id**: Retrieve details of a specific cluster by its ID.


### Kubernetes-native APIs

- **list_namespaces**: List all namespaces within a Huawei CCE cluster.
- **create_namespace**: Create a new namespace in a Huawei CCE cluster.
- **delete_namespace**: Delete an existing namespace in a Huawei CCE cluster.
- **list_pods**: List all pods in a Huawei CCE cluster or namespace.
- **create_pod**: Create a new pod in a Huawei CCE cluster and namespace.
- **read_pod**: Get information about a specific pod in a Huawei CCE cluster.




## Integration Instructions

To use the Huawei Cloud tools, you must provide your Huawei Cloud CCE API authentication token as an environment variable:

- `HUAWEI_CCE_AUTH_TOKEN`: Your Huawei Cloud CCE API authentication token (required)
- `GITLAB_PERSONAL_ACCESS_TOKEN`: Your GitLab personal access token (required)

Example configuration for MCP server integration:

```json
{
    "mcpServers": { 
      "gitlab": {
        "command": "docker",
        "args": [
          "run",
          "--rm",
          "-i",
          "-e",
          "GITLAB_PERSONAL_ACCESS_TOKEN",
          "-e",
          "HUAWEI_CCE_AUTH_TOKEN",
          "tehilathestudent/try-cce-gitlab"
        ],
        "env": {
          "GITLAB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>",
          "HUAWEI_CCE_AUTH_TOKEN": "<your huawei token>"
        }
      }
    }
  }
```

## License

This project is licensed under the MIT License.
