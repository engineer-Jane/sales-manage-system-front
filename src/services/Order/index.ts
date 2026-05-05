import Utils from '@/utils/utils';
import { baseUrl } from '@/utils/request';

const urlPrefix = `${baseUrl}/api/order`;

export async function query(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/selectOrderList`, options);
}

export async function save(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/saveOrUpdateOrder`, options);
}

export async function info(data: any, options?: Record<string, any>) {
  return Utils.get(data, `${urlPrefix}/selectOrderDetail`, options);
}

export async function onDelete(data: any, options?: Record<string, any>) {
  return Utils.delete(data, `${urlPrefix}/deleteOrder`, options);
}

export async function getOrderContract(data: any, options?: Record<string, any>) {
  return Utils.get(data, `${urlPrefix}/getOrderContract`, options);
}