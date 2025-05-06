import { HUAWEI_CCE_AUTH_TOKEN } from './constants.js';
import { logInfo, logError, logHttpRequest, logHttpResponse } from '../../utils/logs.js';
import { HuaweiListNamespacesResponse, HuaweiListNamespacesResponseSchema } from '../../schemas/huawei/index.js';

export async function HuaweiListNamespaces(
  region: string,
  cluster_id: string,
): Promise<HuaweiListNamespacesResponse> {
  logInfo(`HuaweiListNamespaces called with region=${region}, cluster_id=${cluster_id}`);
  if (!HUAWEI_CCE_AUTH_TOKEN) {
    logError('HUAWEI_CCE_AUTH_TOKEN is missing');
    throw new Error('HUAWEI_CCE_AUTH_TOKEN is missing');
  }
  let url = `https://${cluster_id}.cce.${region}.myhuaweicloud.com/api/v1/namespaces`;
  logHttpRequest('GET', url, { 'x-auth-token': HUAWEI_CCE_AUTH_TOKEN });
  try {
    const response = await fetch(url, {
      headers: {
        "x-auth-token": `${HUAWEI_CCE_AUTH_TOKEN}`
      }
    });
    const body = await response.json();
    logHttpResponse(response.status, undefined, body, undefined);
    if (!response.ok) {
      logError(`Huawei CCE API error: ${response.statusText}`);
      throw new Error(`Huawei CCE API error: ${response.statusText}`);
    }
    logInfo('HuaweiListNamespaces succeeded');
    return HuaweiListNamespacesResponseSchema.parse(body);
  } catch (error) {
    logError(`HuaweiListNamespaces error: ${error}`);
    throw error;
  }
}
