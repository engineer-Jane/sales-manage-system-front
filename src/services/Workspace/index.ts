import Utils from '@/utils/utils';
import { baseUrl } from '@/utils/request';

const urlPrefix = `${baseUrl}/api/homepage`;

export async function queryOrder(data: any, options?: Record<string, any>) {
  return Utils.get(data, `${urlPrefix}/homeOrderList`, options);
}

export async function queryPendingAuditOrders(data: any, options?: Record<string, any>) {
  return Utils.get(data, `${urlPrefix}/homePendingAuditOrders`, options);
}

export async function queryPendingAuditQueryOrders(data: any, options?: Record<string, any>) {
  return Utils.get(data, `${urlPrefix}/homePendingAuditQueryOrders`, options);
}

export async function queryPendingPayOrReceiveOrders(data: any, options?: Record<string, any>) {
  return Utils.get(data, `${urlPrefix}/homePendingPayOrReceiveOrders`, options);
}
