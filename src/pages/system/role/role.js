import { axiosClient } from 'common/axiosClient';

// 获取角色列表
export function getRoles(params) {
  return axiosClient.post('admin/Jurisdiction/getListByParamRole', params);
}

// 添加角色
// roleName	string	Y	角色名称
// status	string	Y	是否启用 0：否 1：启用
// adminId	int	Y	操作人id
// ids	string	Y	权限id例：{'“ds”:[1,3,5]}
// sign	string	Y	验签
export function addRole(params) {
  return axiosClient.post('admin/Jurisdiction/addRole', params);
}

// 修改角色
// id	int	Y	角色id
// roleName	string	Y	角色名称
// adminId	int	Y	操作人id
// ids	string	Y	权限id
// type	int	N	如果只修改权限名称传0 名称和权限都修改传1
export function updateRole(params) {
  return axiosClient.post('admin/Jurisdiction/updateRole', params);
}

// 删除角色
// id	int	Y	角色id
// adminId	int	Y	操作人id
export function removeRole(params) {
  return axiosClient.post('admin/Jurisdiction/delRole', params);
}

// 获取角色的权限列表 (编辑时)
// roleId
export function getPermissionList(params) {
  return axiosClient.post('admin/Jurisdiction/getRolePermissionMenuList', params);
}

// 获取全部权限
export function getAllPermission() {
  return axiosClient.post('admin/Jurisdiction/getMenuList', {isAllMenu: 1})
}