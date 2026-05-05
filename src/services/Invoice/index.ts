import Utils from '@/utils/utils';
import { baseUrl } from '@/utils/request';

const urlPrefix = `${baseUrl}/api/invoiceRecord`;

export async function query(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/selectInvoiceRecordList`, options);
}

export async function save(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/saveOrUpdateInvoiceRecord`, options);
}

export async function info(data: any, options?: Record<string, any>) {
  return Utils.get(data, `${urlPrefix}/selectInvoiceRecordDetail`, options);
}

export async function onDelete(data: any, options?: Record<string, any>) {
  return Utils.delete(data, `${urlPrefix}/deleteInvoiceRecord`, options);
}

export async function getInvoiceReceipt(data: any, options?: Record<string, any>) {
  return Utils.get(data, `${urlPrefix}/getInvoiceReceipt`, options);
}

export async function audit(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/invoiceRecordAudit`, options);
}

export async function submit(data: any, options?: Record<string, any>) {
  return Utils.get(data, `${urlPrefix}/invoiceRecordSubmit`, options);
}