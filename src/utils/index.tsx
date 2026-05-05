import { history } from 'umi';
import type { RcFile } from 'antd/es/upload';
import { parse } from 'qs';
import { publicKey } from './request';
import './jsencrypt.min.js';


export const setLocalData = (
  key: string,
  data: Record<string, string | number | boolean> | boolean | any,
) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getLocalData = (key: string) => {
  const data = localStorage.getItem(key);
  if (data !== null && data !== undefined) {
    return JSON.parse(data);
  }
  return {};
};

/**
 * 退出登录，并且将当前的 url 保存
 */
export const localLogout = () => {
  setLocalData('token', '');
  setLocalData('user', {});
  setLocalData('permissionCodes', [] as any);
  const { query = {} } = history.location;
  const { redirect } = query;
  const prePageName = '/home';
  if (window.location.pathname !== '/user/login' && !redirect) {
    window.location.href = `/user/login?redirect=${prePageName}`;
  }
};

/**
 * 获取url参数
 * @returns
 */
export const getPageQuery = () => {
  return parse(window.location.href.split('?')[1]);
};

export const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

/** obj转换成array */
export const TransfArrObj = (arr: any) => {
  const obj: any = {};
  arr.map((v: any) => {
    obj[v.value] = v.label
  })

  return obj;
}

// 加密
export const setEncrypt = (msg: string) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  const encryptMsg = encrypt.encrypt(msg);
  return encryptMsg;
}

// 解密
export const getDecrypt = (msg: string) => {
  const decrypt = new JSEncrypt();
  decrypt.setPrivateKey(publicKey);
  const decryptMsg = decrypt.decrypt(msg);
  return decryptMsg
}