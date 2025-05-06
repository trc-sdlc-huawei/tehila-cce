import { HUAWEI_CCE_AUTH_TOKEN } from './constants.js';
import { logInfo, logError, logHttpRequest, logHttpResponse } from '../../utils/logs.js';
import { HuaweiNamespaceSchema, type HuaweiNamespace } from '../../schemas/huawei/index.js';

export async function HuaweiGetNamespaceByName(
  region: string,
  cluster_id: string,
  name: string
): Promise<HuaweiNamespace> {
  logInfo(`HuaweiGetNamespaceByName called with region=${region}, cluster_id=${cluster_id}, name=${name}`);
  if (!HUAWEI_CCE_AUTH_TOKEN) {
    logError('HUAWEI_CCE_AUTH_TOKEN is missing');
    throw new Error('HUAWEI_CCE_AUTH_TOKEN is missing');
  }
  const url = `https://${cluster_id}.cce.${region}.myhuaweicloud.com/api/v1/namespaces/${name}`;
  const headers: Record<string, string> = {
    'x-auth-token': HUAWEI_CCE_AUTH_TOKEN,
    'Content-Type': 'application/json',
  };
  logHttpRequest(url, 'GET', headers);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers as Record<string, string>,
    });
    const respBody = await response.json();
    logHttpResponse(response.status, undefined, respBody, undefined);
    if (!response.ok) {
      logError(`Huawei CCE API error: ${response.statusText}`);
      throw new Error(`Huawei CCE API error: ${response.statusText}`);
    }
    logInfo('HuaweiGetNamespaceByName succeeded');
    return HuaweiNamespaceSchema.parse(respBody);
  } catch (error) {
    logError(`HuaweiGetNamespaceByName error: ${error}`);
    throw error;
  }
}
