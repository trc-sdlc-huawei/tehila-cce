import {
    type HuaweiListClustersResponse,
    HuaweiListClustersResponseSchema,
    HuaweiGetClusterByIdParams,
    HuaweiGetClusterByIdResponse,
    HuaweiGetClusterByIdResponseSchema
} from '../../schemas/huawei/index.js';
import { HUAWEI_CCE_AUTH_TOKEN } from './constants.js';
import { logInfo, logError, logHttpRequest, logHttpResponse } from '../../utils/logs.js';

export async function HuaweiListClusters(
    region: string,
    project_id: string
): Promise<HuaweiListClustersResponse> {
    logInfo(`HuaweiListClusters called with region=${region}, project_id=${project_id}`);
    if (!HUAWEI_CCE_AUTH_TOKEN) {
        logError('HUAWEI_CCE_AUTH_TOKEN is missing');
        throw new Error('HUAWEI_CCE_AUTH_TOKEN is missing');
    }
    const url = new URL(`https://cce.${region}.myhuaweicloud.com/api/v3/projects/${project_id}/clusters`);
    logHttpRequest('GET', url.toString(), { 'x-auth-token':HUAWEI_CCE_AUTH_TOKEN });
    try {
        const response = await fetch(url.toString(), {
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
        logInfo('HuaweiListClusters succeeded');
        return HuaweiListClustersResponseSchema.parse(body);
    } catch (error) {
        logError(`HuaweiListClusters error: ${error}`);
        throw error;
    }
}