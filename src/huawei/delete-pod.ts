import { HUAWEI_CCE_AUTH_TOKEN } from './constants.js';
import { logInfo, logError, logHttpRequest, logHttpResponse } from '../../utils/logs.js';
import { HuaweiPodSchema, type HuaweiPod } from '../../schemas/huawei/entities/pod.js';

export async function HuaweiDeletePod(
  region: string,
  cluster_id: string,
  namespace: string,
  pod_name: string
): Promise<HuaweiPod> {
  logInfo(`HuaweiDeletePod called with region=${region}, cluster_id=${cluster_id}, namespace=${namespace}, pod_name=${pod_name}`);
  if (!HUAWEI_CCE_AUTH_TOKEN) {
    logError('HUAWEI_CCE_AUTH_TOKEN is missing');
    throw new Error('HUAWEI_CCE_AUTH_TOKEN is missing');
  }
  const url = `https://${cluster_id}.cce.${region}.myhuaweicloud.com/api/v1/namespaces/${namespace}/pods/${pod_name}`;
  const headers: Record<string, string> = {
    'x-auth-token': HUAWEI_CCE_AUTH_TOKEN,
    'Content-Type': 'application/json',
  };
  logHttpRequest(url, 'DELETE', headers);
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: headers as Record<string, string>,
    });
    const respBody = await response.json();
    logHttpResponse(response.status, undefined, respBody, undefined);
    if (!response.ok) {
      logError(`Huawei CCE API error: ${response.statusText}`);
      throw new Error(`Huawei CCE API error: ${response.statusText}`);
    }
    logInfo('HuaweiDeletePod succeeded');
    return HuaweiPodSchema.parse(respBody);
  } catch (error) {
    logError(`HuaweiDeletePod error: ${error}`);
    throw error;
  }
}
