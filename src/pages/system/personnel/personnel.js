import { axiosClient } from 'common/axiosClient';

// 获取人员列表
export function getPersonnelList(params) {
  return axiosClient.post('admin/Jurisdiction/getListByParamUser', params)
}

// 获取角色列表
export function getRoles(params) {
  return axiosClient.post('admin/Jurisdiction/getListByParamRole', params);
}

// 获取人员详情
export function getPersonnelDetail(parmas) {
  return axiosClient.post('admin/User/managerDetail', parmas);
}

// 更新人员详情
export function updatePersonnel(params) {
  return axiosClient.post('admin/User/managerUpdate', params);
}

// 新增人员
export function addPersonnel(params) {
  return axiosClient.post('admin/User/register', params)
}