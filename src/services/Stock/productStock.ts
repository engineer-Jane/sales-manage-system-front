import Utils from '@/utils/utils';
import { baseUrl } from '@/utils/request';

const urlPrefix = `${baseUrl}/api/productStock`;

export async function query(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/selectProductStockList`, options);
}