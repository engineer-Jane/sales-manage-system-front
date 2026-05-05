import Utils from '@/utils/utils';
import { baseUrl } from '@/utils/request';

const urlPrefix = `${baseUrl}/api/costApply`;

export async function query(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/selectCostApplyList`, options);
}

export async function save(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/saveOrUpdateCostApply`, options);
}

export async function info(data: any, options?: Record<string, any>) {
  return Utils.get(data, `${urlPrefix}/selectCostApplyDetail`, options);
}

export async function onDelete(data: any, options?: Record<string, any>) {
  return Utils.delete(data, `${urlPrefix}/deleteCostApply`, options);
}

export async function audit(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/costApplyAudit`, options);
}

export async function submit(data: any, options?: Record<string, any>) {
  return Utils.get(data, `${urlPrefix}/costApplySubmit`, options);
}
