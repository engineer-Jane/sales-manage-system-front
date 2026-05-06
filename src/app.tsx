import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import defaultSettings from '../config/defaultSettings';
import { isMockApiEnabled, resolveSalesMock } from '@/utils/mockApiClient';
import { getAllRegisteredCodes, withDefaultWorkspaceAccess } from '@/constants/permissionRegistry';
import { getLocalData, setLocalData } from './utils';

/**
 * 必须在运行时挂在 @umijs/plugin-request 上：全局拦截所有 `request` / `useRequest`，
 * 否则仅 `Utils.init(withSalesMock(request))` 无法覆盖直连 `umi` 的请求，Vercel 上仍会 fetch /api 触发「http error」。
 */
export const request: RequestConfig = {
  middlewares: [
    async (ctx, next) => {
      const url = ctx.req?.url ?? '';
      const method = String(ctx.req?.options?.method ?? 'GET').toUpperCase();
      if (isMockApiEnabled()) {
        const mockBody = resolveSalesMock(method, url);
        if (mockBody !== undefined) {
          ctx.res = mockBody;
          return;
        }
      }
      await next();
    },
  ],
};

// const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  permissionCodes?: any;
  fetchPermissionCodes?: () => Promise<[] | undefined>;
}> {
  const fetchPermissionCodes = async () => {
    try {
      const raw = await getLocalData('permissionCodes');
      const arr = Array.isArray(raw) ? raw : [];
      if (!arr.length) {
        const fallback = getAllRegisteredCodes();
        await setLocalData('permissionCodes', fallback);
        return fallback;
      }
      const merged = withDefaultWorkspaceAccess(arr);
      if (merged.length !== arr.length) {
        await setLocalData('permissionCodes', merged);
      }
      return merged;
    } catch (error) {
      history.push(loginPath);
    }
    return [];
  };

  const fetchUserInfo = async () => {
    try {
      // const msg = await authApi.info({});
      // return msg.data;
      const currentUser = await getLocalData('user');
      return currentUser;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    const permissionCodes = await fetchPermissionCodes();
    return {
      fetchUserInfo,
      currentUser,
      permissionCodes,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    fetchPermissionCodes,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    // waterMarkProps: {
    //   content: initialState?.currentUser?.name,
    // },
    // footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {/* {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )} */}
        </>
      );
    },
    ...initialState?.settings,
  };
};
