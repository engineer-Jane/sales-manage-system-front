/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { notification } from 'antd';
import { getLocalData, localLogout } from '@/utils';
// import { request } from 'umi';
import { extend } from 'umi-request';
// TODO: 403接口权限先不加
// import { processApi403, getLocalData } from './index';

import { isMockApiEnabled } from '@/utils/mockApiClient';

/** 显式配置的网关（一般为 https://api.xxx）；未配置时不要对 HTTPS 页面使用默认 HTTP，否则浏览器 Mixed Content 会直接 Failed to fetch */
const fallbackDevGateway = 'http://k9wibb.natappfree.cc';

function resolveBaseUrl(): string {
  if (isMockApiEnabled()) return '';
  const fromEnv = (process.env.REACT_APP_API_HOST || '').trim();
  if (fromEnv) return fromEnv;
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    return '';
  }
  return fallbackDevGateway;
}

export const baseUrl = resolveBaseUrl();
export const fileUrl = baseUrl;
// 公钥
export const publicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC6DXRxJ6lpsnX8Z5buAgQG+7CWNAV73GX6POIwFo59vI5PxaO4LJQKxu5h5i7Sn3KnNyWky9kAY66Kg9iZQEtwIIoP7FaaYoAHGlh1m6BNrs7WOm0eyRKUnxxKnMpcV1ES31YdrxWga9LDBtq3eWgOOplVospgs9wGG9AI1aMeNQIDAQAB`;


const isDev = process.env.NODE_ENV !== 'production';
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 网络异常处理程序
 */
export const errorHandler = (error: any) => {
  const { response } = error;
  console.log('errorHandler-----', response);
  if (response && response.status) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    if ([401, 403].includes(status)) {
      localLogout();
    }
    // if (status === 403) {
    //   processApi403();
    // }
    if (isDev) {
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errorText,
      });
    }
  } else if (!response) {
    const errorText = error.message.indexOf('timeout') !== -1 ? '请求超时' : '请求失败';
    if (isDev) {
      notification.error({
        description: errorText,
        message: '网络异常',
      });
    }
    return {
      msg: errorText,
      code: -9999,
    };
  }
  return response;
};

export const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    // token: getLocalData("token")
    authorization: getLocalData("token")
  },
  throwErrIfParseFail: true, //当JSON.parse(res) 出错时，抛出错误
});

request.interceptors.request.use(async (url, options) => {
  if (
    options.method === 'post' ||
    options.method === 'put' ||
    options.method === 'delete' ||
    options.method === 'get'
  ) {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // token: getLocalData("token"),
      authorization: getLocalData("token")
    };
    return {
      url,
      options: { ...options, headers },
    };
  }
});

export const commonPostRequest = (data: any, url: string, options?: Record<string, any>) => {
  return request<Record<string, any>>(`${url}`, {
    method: 'POST',
    data,
    ...(options || {}),
  });
};

export const commonGetRequest = (data: any, url: string, options?: Record<string, any>) => {
  return request<Record<string, any>>(`${url}`, {
    method: 'GET',
    data,
    ...(options || {}),
  });
};
