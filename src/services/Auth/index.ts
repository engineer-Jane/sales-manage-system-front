import Utils from '@/utils/utils';
import { baseUrl } from '@/utils/request';

const urlPrefix = `${baseUrl}/api/auth`;

export async function code(data: any, options?: Record<string, any>) {
  return Utils.get(data, `${urlPrefix}/code`, options);
}

export async function info(data: any, options?: Record<string, any>) {
  return Utils.get(data, `${urlPrefix}/info`, options);
}

export async function login(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/login`, options);
}

export async function logout(data: any, options?: Record<string, any>) {
  return Utils.delete(data, `${urlPrefix}/logout`, options);
}
