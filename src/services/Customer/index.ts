import Utils from '@/utils/utils';
import { baseUrl } from '@/utils/request';

const urlPrefix = `${baseUrl}/api/customer`;

export async function query(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/selectCustomerList`, options);
}

export async function save(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/saveOrUpdateCustomer`, options);
}

export async function info(data: any, options?: Record<string, any>) {
  return Utils.get(data, `${urlPrefix}/selectCustomerDetail`, options);
}

export async function onDelete(data: any, options?: Record<string, any>) {
  return Utils.delete(data, `${urlPrefix}/deleteCustomer`, options);
}
