import Utils from '@/utils/utils';
import { baseUrl } from '@/utils/request';

const urlPrefix = `${baseUrl}/api/user`;

export async function query(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/selectUserList`, options);
}

export async function save(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/saveOrUpdateUser`, options);
}

export async function info(data: any, options?: Record<string, any>) {
  return Utils.get(data, `${urlPrefix}/selectUserDetail`, options);
}

export async function onDelete(data: any, options?: Record<string, any>) {
  return Utils.delete(data, `${urlPrefix}/deleteUser`, options);
}


// 系统权限接口
// 部门角色关系
export async function saveOrUpdateRoleDepartmentRelation(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/saveOrUpdateRoleDepartmentRelation`, options);
}
// 角色资源（权限）关系
export async function saveOrUpdateRoleResourceRelation(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/saveOrUpdateRoleResourceRelation`, options);
}
// 用户部门关系
export async function saveOrUpdateUserDepartmentRelation(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/saveOrUpdateUserDepartmentRelation`, options);
}
// 用户角色关系
export async function saveOrUpdateUserRoleRelation(data: any, options?: Record<string, any>) {
  return Utils.post(data, `${urlPrefix}/saveOrUpdateUserRoleRelation`, options);
}

// 根据角色Id查询资源(权限code)列表
export async function getPermissionCodes(data: any, options?: Record<string, any>) {
  return Utils.get(data, `${urlPrefix}/selectResourceCodeListByRoleId`, options);
}
// 根据角色Id查询资源(权限)列表
export async function selectResourceListByRoleId(data: any, options?: Record<string, any>) {
  return Utils.get(data, `${urlPrefix}/selectResourceListByRoleId`, options);
}
// 根据部门id查询可访问菜单列表
export async function selectRoleListByDepartmentId(data: any, options?: Record<string, any>) {
  return Utils.get(data, `${urlPrefix}/selectRoleListByDepartmentId`, options);
}
// 根据用户id查询角色列表
export async function selectRoleListByUserId(data: any, options?: Record<string, any>) {
  return Utils.get(data, `${urlPrefix}/selectRoleListByUserId`, options);
}
// 根据部门id查询部门人员列表
export async function selectUserListByDepartmentId(data: any, options?: Record<string, any>) {
  return Utils.get(data, `${urlPrefix}/selectUserListByDepartmentId`, options);
}
