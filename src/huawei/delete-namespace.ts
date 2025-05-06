import { HUAWEI_CCE_AUTH_TOKEN } from './constants.js';
import { logInfo, logError, logHttpRequest, logHttpResponse } from '../../utils/logs.js';
import { HuaweiNamespaceSchema, HuaweiNamespace } from '../../schemas/huawei/index.js';

export async function HuaweiDeleteNamespace(
  region: string,
  cluster_id: string,
  name: string,
  opts: {
    dryRun?: string,
    gracePeriodSeconds?: number,
    ignoreStoreReadErrorWithClusterBreakingPotential?: boolean,
    pretty?: string,
    propagationPolicy?: string,
  } = {}
): Promise<HuaweiNamespace> {
  logInfo(`HuaweiDeleteNamespace called with region=${region}, cluster_id=${cluster_id}, name=${name}, opts=${JSON.stringify(opts)}`);
  if (!HUAWEI_CCE_AUTH_TOKEN) {
    logError('HUAWEI_CCE_AUTH_TOKEN is missing');
    throw new Error('HUAWEI_CCE_AUTH_TOKEN is missing');
  }
  const url = new URL(`https://${cluster_id}.cce.${region}.myhuaweicloud.com/api/v1/namespaces/${name}`);
  Object.entries(opts).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.append(key, String(value));
  });
  logHttpRequest('DELETE', url.toString(), { 'x-auth-token': HUAWEI_CCE_AUTH_TOKEN });
  try {
    const response = await fetch(url.toString(), {
      method: 'DELETE',
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
    logInfo('HuaweiDeleteNamespace succeeded');
    return HuaweiNamespaceSchema.parse(body);
  } catch (error) {
    logError(`HuaweiDeleteNamespace error: ${error}`);
    throw error;
  }
}
