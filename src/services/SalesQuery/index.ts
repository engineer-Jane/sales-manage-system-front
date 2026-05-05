import Utils from '@/utils/utils';
import { baseUrl } from '@/utils/request';

const urlPrefix = `${baseUrl}/api/salesQuery`;

export async function query(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/selectSalesQueryInfoList`, options);
}

export async function save(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/saveOrUpdateSalesQueryInfo`, options);
}

export async function info(data: any, options?: Record<string, any>) {
  return Utils.get(data, `${urlPrefix}/selectSalesQueryInfoDetail`, options);
}

export async function onDelete(data: any, options?: Record<string, any>) {
  return Utils.delete(data, `${urlPrefix}/deleteSalesQueryInfo`, options);
}

export async function reply(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/salesQueryInfoReply`, options);
}

export async function audit(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/salesQueryInfoAudit`, options);
}

export async function submit(data: any, options?: Record<string, any>) {
  return Utils.get(data, `${urlPrefix}/salesQueryInfoSubmit`, options);
}
