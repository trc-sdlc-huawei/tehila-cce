# Available Huawei Cloud Tools

## Proprietary CCE APIs

### Cluster-related APIs
- **list_clusters**: List all clusters in a Huawei CCE project.
- **get_cluster_by_id**: Retrieve details of a specific cluster by its ID.


## Kubernetes-native APIs

- **Namespace APIs**:
  - **list_namespaces**: List all namespaces.
  - **get_namespace_by_name**: Retrieve details of a specific namespace by its name.
  - **create_namespace**: Create a new namespace.
  - **delete_namespace**: Delete an existing namespace.
- **Pod APIs**:
  - **list_pods**: List all pods.
  - **list_pods_by_namespace**: List all pods in a namespace.
  - **get_pod_by_name_and_namespace**: Retrieve details of a specific pod by its name and namespace.
  - **create_pod**: Create a new pod and namespace.
  - **read_pod**: Get information about a specific pod.
  - **delete_pod**: Delete an existing pod.
  - **delete_all_pods_in_namespace**: Delete all pods in a namespace.




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
