# Available Huawei Cloud Tools

## Proprietary CCE APIs

### Cluster-related APIs
- **list_clusters**: List all clusters in a Huawei CCE project.
- **get_cluster_by_id**: Retrieve details of a specific cluster by its ID.


## Kubernetes-native APIs

- **Namespace APIs**:
  - **GET list_namespaces**: List all namespaces.
  - **GET get_namespace_by_name**: Retrieve details of a specific namespace by its name.
  - **POST create_namespace**: Create a new namespace.
  - **DELETE delete_namespace**: Delete an existing namespace.
- **Pod APIs**:
  - **GET list_pods**: List all pods.
  - **GET list_pods_by_namespace**: List all pods in a namespace.
  - **GET get_pod_by_name_and_namespace**: Retrieve details of a specific pod by its name and namespace.
  - **POST create_pod**: Create a new pod and namespace.
  - **DELETE delete_pod**: Delete an existing pod.



## Integration Instructions

To use the Huawei Cloud tools, you must provide your Huawei Cloud CCE API authentication token as an environment variable:

- `HUAWEI_CCE_AUTH_TOKEN`: Your Huawei Cloud CCE API authentication token (required)

Example configuration for MCP server integration:

( logging is optional, no logging if LOG_FILE_PATH is not set )

- json with docker

```json
{
    "mcpServers": { 
      "try-cce": {
        "command": "docker",
        "args": [
          "run",
          "--rm",
          "-i",
          "-e",
          "HUAWEI_CCE_AUTH_TOKEN",
          "-e",
          "LOG_FILE_PATH",
          "tehilathestudent/try-cce"
        ],
        "env": {
          "HUAWEI_CCE_AUTH_TOKEN": "<your huawei token>",
          "LOG_FILE_PATH": ""
        }
      }
    }
  }
```


- json with node

```json
{
    "mcpServers": {
        "try-cce": {
            "command": "npx",
            "args": [
                "-y",
                "@tehilathestudent/mcp-server-huawei-cce"
            ],
            "env": {
                "HUAWEI_CCE_AUTH_TOKEN": "<your huawei token>",
                "LOG_FILE_PATH": ""
            }
        }
    }
}
```

## example prompt

- list all my namespaces from huawei cloud cce

