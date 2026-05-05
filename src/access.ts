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
  permissionCodes?: [];
}) {
  const permissionCodes = initialState?.permissionCodes || [];
  return {
    auth: (auth: string) => permissionCodes?.includes(auth), // 按业务需求自己任意定义鉴权函数
    normalRouteFilter: (route: any) => permissionCodes?.includes(route?.auth), // initialState 中包含了的路由才有权限访问
  };
}
