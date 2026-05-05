import { SALES_API_MOCK_BODY, type MockJsonBody } from '@/mock/apiHandlers';

/**
 * 是否与开发环境一致走本地 Mock、不发起真实网关请求。
 * 默认开启（含生产构建）；仅当构建/环境变量显式设置 REACT_APP_USE_MOCK_API=false 时关闭并连接真实后端（需配置 REACT_APP_API_HOST 等）。
 */
export function isMockApiEnabled(): boolean {
  return process.env.REACT_APP_USE_MOCK_API !== 'false';
}

function normalizeApiPath(url: string): string {
  if (!url) return '';
  const withoutQuery = url.split('?')[0];
  if (withoutQuery.startsWith('http://') || withoutQuery.startsWith('https://')) {
    try {
      return new URL(withoutQuery).pathname;
    } catch {
      return withoutQuery;
    }
  }
  return withoutQuery;
}

/**
 * 未在 SALES_API_MOCK_BODY 中声明的 /api 请求：在 Mock 模式下给兜底值。
 * 避免 Vercel 等纯静态托管上真实请求 /api 得到 404，umi-request 判定非 2xx 抛出「http error」。
 */
function defaultMockForUnlistedApi(method: string, path: string): MockJsonBody {
  const m = method.toUpperCase();
  if (m === 'DELETE') {
    return { code: 200, data: null, msg: 'success' };
  }
  if (m === 'GET') {
    if (/List|list|Tree|tree|select/i.test(path)) {
      return { code: 200, data: { records: [], total: 0 }, msg: 'success' };
    }
    return { code: 200, data: {}, msg: 'success' };
  }
  if (m === 'POST' || m === 'PUT' || m === 'PATCH') {
    if (/List|list|select|export|query|page|Tree|tree/i.test(path)) {
      return { code: 200, data: { records: [], total: 0 }, msg: 'success' };
    }
    return { code: 200, data: null, msg: 'success' };
  }
  return { code: 200, data: null, msg: 'success' };
}

/**
 * 命中销售系统 Mock；Mock 开启且路径为 /api/* 时，未配置的接口也会返回兜底，不再发真实 HTTP。
 */
export function resolveSalesMock(method: string, url: string): MockJsonBody | undefined {
  const path = normalizeApiPath(url);
  const key = `${method.toUpperCase()} ${path}`;
  const hit = SALES_API_MOCK_BODY[key];
  if (hit !== undefined) return hit;
  if (!isMockApiEnabled()) return undefined;
  if (!path.startsWith('/api/')) return undefined;
  return defaultMockForUnlistedApi(method, path);
}

/** 包装 umi-request：Mock 开启时优先短路，避免遗漏 Utils.init 之外的直连调用 */
export function withSalesMockRequest<T extends (url: string, options?: unknown) => Promise<unknown>>(
  umiRequest: T,
): T {
  const wrapped = ((url: string, options?: unknown) => {
    const opt = options as { method?: string } | undefined;
    const method = String(opt?.method || 'GET').toUpperCase();
    if (isMockApiEnabled()) {
      const mockBody = resolveSalesMock(method, url);
      if (mockBody !== undefined) {
        return Promise.resolve(mockBody);
      }
    }
    return umiRequest(url, options);
  }) as T;
  Object.assign(wrapped, umiRequest);
  return wrapped;
}
