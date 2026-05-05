import Utils from '@/utils/utils';
import { baseUrl } from '@/utils/request';

const urlPrefix = `${baseUrl}/api/costType`;

export async function query(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/selectCostList`, options);
}

export async function save(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/saveOrUpdateCost`, options);
}

export async function info(data: any, options?: Record<string, any>) {
  return Utils.get(data, `${urlPrefix}/selectCostDetail`, options);
}

export async function onDelete(data: any, options?: Record<string, any>) {
  return Utils.delete(data, `${urlPrefix}/deleteCost`, options);
}
