import { HUAWEI_CCE_AUTH_TOKEN } from './constants.js';
import { logInfo, logError, logHttpRequest, logHttpResponse } from '../../utils/logs.js';
import { HuaweiPodSchema, HuaweiPod } from '../../schemas/huawei/index.js';

export async function HuaweiCreatePod(
  region: string,
  cluster_id: string,
  namespace: string,
  pod_name: string,
  container_name: string,
  image: string,
  opts: {
    dryRun?: string,
    fieldManager?: string,
    fieldValidation?: string,
    pretty?: string,
  } = {}
): Promise<HuaweiPod> {
  logInfo(`HuaweiCreatePod called with region=${region}, cluster_id=${cluster_id}, namespace=${namespace}, pod_name=${pod_name}, container_name=${container_name}, image=${image}, opts=${JSON.stringify(opts)}`);
  if (!HUAWEI_CCE_AUTH_TOKEN) {
    logError('HUAWEI_CCE_AUTH_TOKEN is missing');
    throw new Error('HUAWEI_CCE_AUTH_TOKEN is missing');
  }
  let url = `https://${cluster_id}.cce.${region}.myhuaweicloud.com/api/v1/namespaces/${namespace}/pods`;
  const params: string[] = [];
  if (opts.dryRun) params.push(`dryRun=${encodeURIComponent(opts.dryRun)}`);
  if (opts.fieldManager) params.push(`fieldManager=${encodeURIComponent(opts.fieldManager)}`);
  if (opts.fieldValidation) params.push(`fieldValidation=${encodeURIComponent(opts.fieldValidation)}`);
  if (opts.pretty) params.push(`pretty=${encodeURIComponent(opts.pretty)}`);
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }

  const body = {
    kind: "Pod",
    apiVersion: "v1",
    metadata: { name: pod_name },
    spec: {
      containers: [
        {
          name: container_name,
          image: image
        }
      ]
    },
    status: {}
  };

  logHttpRequest('POST', url.toString(), { 'x-auth-token': HUAWEI_CCE_AUTH_TOKEN });
  try {
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        "x-auth-token": `${HUAWEI_CCE_AUTH_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const respBody = await response.json();
    logHttpResponse(response.status, undefined, respBody, undefined);
    if (!response.ok) {
      logError(`Huawei CCE API error: ${response.statusText}`);
      throw new Error(`Huawei CCE API error: ${response.statusText}`);
    }
    logInfo('HuaweiCreatePod succeeded');
    return HuaweiPodSchema.parse(respBody);
  } catch (error) {
    logError(`HuaweiCreatePod error: ${error}`);
    throw error;
  }
}
