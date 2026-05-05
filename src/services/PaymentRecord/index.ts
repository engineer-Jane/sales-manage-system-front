import Utils from '@/utils/utils';
import { baseUrl } from '@/utils/request';

const urlPrefix = `${baseUrl}/api/paymentRecord`;

export async function query(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/selectPaymentRecordList`, options);
}

export async function save(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/saveOrUpdatePaymentRecord`, options);
}

export async function info(data: any, options?: Record<string, any>) {
  return Utils.get(data, `${urlPrefix}/selectPaymentRecordDetail`, options);
}

export async function onDelete(data: any, options?: Record<string, any>) {
  return Utils.delete(data, `${urlPrefix}/deletePaymentRecord`, options);
}
