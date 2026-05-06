/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
// export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
//   const { currentUser } = initialState ?? {};
//   return {
//     canAdmin: currentUser && currentUser.access === 'admin',
//   };
// }
export default function access(initialState: {
  currentUser?: any | undefined;
  permissionCodes?: unknown;
}) {
  const raw = initialState?.permissionCodes;
  const permissionCodes = Array.isArray(raw) ? raw : [];
  return {
    auth: (auth: string) => permissionCodes.includes(auth),
    /** 未配置 auth 的路由不做菜单过滤（例如权限配置页） */
    normalRouteFilter: (route: any) => {
      const code = route?.auth;
      if (code === undefined || code === null || code === '') return true;
      return permissionCodes.includes(code);
    },
  };
}
