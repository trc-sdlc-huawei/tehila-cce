import { HUAWEI_CCE_AUTH_TOKEN } from './constants.js';
import { logInfo, logError, logHttpRequest, logHttpResponse } from '../../utils/logs.js';
import { HuaweiListPodsResponseSchema, HuaweiListPodsResponse } from '../../schemas/huawei/index.js';

export async function HuaweiListPods(
  region: string,
  cluster_id: string,
  opts: {
    labelSelector?: string,
    fieldSelector?: string,
    limit?: number,
    continue?: string,
    pretty?: string,
  } = {}
): Promise<HuaweiListPodsResponse> {
  logInfo(`HuaweiListPods called with region=${region}, cluster_id=${cluster_id}, opts=${JSON.stringify(opts)}`);
  if (!HUAWEI_CCE_AUTH_TOKEN) {
    logError('HUAWEI_CCE_AUTH_TOKEN is missing');
    throw new Error('HUAWEI_CCE_AUTH_TOKEN is missing');
  }
  let url = `https://${cluster_id}.cce.${region}.myhuaweicloud.com/api/v1/pods`;
  const params: string[] = [];
  if (opts.labelSelector) params.push(`labelSelector=${encodeURIComponent(opts.labelSelector)}`);
  if (opts.fieldSelector) params.push(`fieldSelector=${encodeURIComponent(opts.fieldSelector)}`);
  if (opts.limit !== undefined) params.push(`limit=${opts.limit}`);
  if (opts.continue) params.push(`continue=${encodeURIComponent(opts.continue)}`);
  if (opts.pretty) params.push(`pretty=${encodeURIComponent(opts.pretty)}`);
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
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
    logInfo('HuaweiListPods succeeded');
    return HuaweiListPodsResponseSchema.parse(respBody);
  } catch (error) {
    logError(`HuaweiListPods error: ${error}`);
    throw error;
  }
}
