import { HUAWEI_CCE_AUTH_TOKEN } from './constants.js';
import { logInfo, logError, logHttpRequest, logHttpResponse } from '../../utils/logs.js';
import { HuaweiNamespaceSchema, HuaweiNamespace } from '../../schemas/huawei/index.js';

export async function HuaweiCreateNamespace(
  region: string,
  cluster_id: string,
  body: any,
): Promise<HuaweiNamespace> {
  logInfo(`HuaweiCreateNamespace called with region=${region}, cluster_id=${cluster_id}, body=${JSON.stringify(body)}`);
  if (!HUAWEI_CCE_AUTH_TOKEN) {
    logError('HUAWEI_CCE_AUTH_TOKEN is missing');
    throw new Error('HUAWEI_CCE_AUTH_TOKEN is missing');
  }
  let url = `https://${cluster_id}.cce.${region}.myhuaweicloud.com/api/v1/namespaces`;

  const urlObject = new URL(url);
  logHttpRequest('POST', urlObject.toString(), { 'x-auth-token': HUAWEI_CCE_AUTH_TOKEN });
  try {
    const response = await fetch(urlObject.toString(), {
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
    logInfo('HuaweiCreateNamespace succeeded');
    return HuaweiNamespaceSchema.parse(respBody);
  } catch (error) {
    logError(`HuaweiCreateNamespace error: ${error}`);
    throw error;
  }
}
