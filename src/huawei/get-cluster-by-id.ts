import { HUAWEI_CCE_AUTH_TOKEN } from './constants.js';
import { logInfo, logError, logHttpRequest, logHttpResponse } from '../../utils/logs.js';
import {
  HuaweiGetClusterByIdResponse,
  HuaweiGetClusterByIdResponseSchema
} from '../../schemas/huawei/index.js';

export async function HuaweiGetClusterById(
  region: string,
  project_id: string,
  cluster_id: string,
): Promise<HuaweiGetClusterByIdResponse> {
  logInfo(`HuaweiGetClusterById called with region=${region}, project_id=${project_id}, cluster_id=${cluster_id}`);
  if (!HUAWEI_CCE_AUTH_TOKEN) {
    logError('HUAWEI_CCE_AUTH_TOKEN is missing');
    throw new Error('HUAWEI_CCE_AUTH_TOKEN is missing');
  }
  let url = `https://cce.${region}.myhuaweicloud.com/api/v3/projects/${project_id}/clusters/${cluster_id}`;
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
    logInfo('HuaweiGetClusterById succeeded');
    return HuaweiGetClusterByIdResponseSchema.parse(body);
  } catch (error) {
    logError(`HuaweiGetClusterById error: ${error}`);
    throw error;
  }
}
