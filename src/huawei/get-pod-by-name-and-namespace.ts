import { HUAWEI_CCE_AUTH_TOKEN } from './constants.js';
import { logInfo, logError, logHttpRequest, logHttpResponse } from '../../utils/logs.js';
import { HuaweiPodSchema, type HuaweiPod } from '../../schemas/huawei/index.js';

export async function HuaweiReadPod(
  region: string,
  cluster_id: string,
  namespace: string,
  pod_name: string,
  opts: { pretty?: string } = {}
): Promise<HuaweiPod> {
  logInfo(`HuaweiReadPod called with region=${region}, cluster_id=${cluster_id}, namespace=${namespace}, pod_name=${pod_name}, opts=${JSON.stringify(opts)}`);
  if (!HUAWEI_CCE_AUTH_TOKEN) {
    logError('HUAWEI_CCE_AUTH_TOKEN is missing');
    throw new Error('HUAWEI_CCE_AUTH_TOKEN is missing');
  }
  let url = `https://${cluster_id}.cce.${region}.myhuaweicloud.com/api/v1/namespaces/${namespace}/pods/${pod_name}`;
  if (opts.pretty) {
    url += `?pretty=${encodeURIComponent(opts.pretty)}`;
  }
  Object.entries(opts).forEach(([key, value]) => {
    if (value !== undefined && key !== 'pretty') url += `&${key}=${String(value)}`;
  });
  logHttpRequest('GET', url, { 'x-auth-token': HUAWEI_CCE_AUTH_TOKEN });
  try {
    const response = await fetch(url, {
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
    return HuaweiPodSchema.parse(respBody); // Use this if you have a schema
  } catch (error) {
    logError(`HuaweiReadPod error: ${error}`);
    throw error;
  }
}
