import { HUAWEI_CCE_AUTH_TOKEN } from './constants.js';
import { logInfo, logError, logHttpRequest, logHttpResponse } from '../../utils/logs.js';
// If you have a schema for pod, import it here. Otherwise, use 'any' for now.
// import { HuaweiPodSchema, HuaweiPod } from '../../schemas/huawei/index.js';

export async function HuaweiReadPod(
  region: string,
  cluster_id: string,
  namespace: string,
  pod_name: string,
  opts: { pretty?: string } = {}
): Promise<any> {
  logInfo(`HuaweiReadPod called with region=${region}, cluster_id=${cluster_id}, namespace=${namespace}, pod_name=${pod_name}, opts=${JSON.stringify(opts)}`);
  if (!HUAWEI_CCE_AUTH_TOKEN) {
    logError('HUAWEI_CCE_AUTH_TOKEN is missing');
    throw new Error('HUAWEI_CCE_AUTH_TOKEN is missing');
  }
  const url = new URL(`https://${cluster_id}.cce.${region}.myhuaweicloud.com/api/v1/namespaces/${namespace}/pods/${pod_name}`);
  Object.entries(opts).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.append(key, String(value));
  });
  logHttpRequest('GET', url.toString(), { 'x-auth-token': HUAWEI_CCE_AUTH_TOKEN });
  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        "x-auth-token": `${HUAWEI_CCE_AUTH_TOKEN}`
      }
    });
    const respBody = await response.json();
    logHttpResponse(response.status, undefined, respBody, undefined);
    if (!response.ok) {
      logError(`Huawei CCE API error: ${response.statusText}`);
      throw new Error(`Huawei CCE API error: ${response.statusText}`);
    }
    logInfo('HuaweiReadPod succeeded');
    // return HuaweiPodSchema.parse(respBody); // Use this if you have a schema
    return respBody;
  } catch (error) {
    logError(`HuaweiReadPod error: ${error}`);
    throw error;
  }
}
