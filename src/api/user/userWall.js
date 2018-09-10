import { axiosClient } from 'common/axiosClient';

// 获取上墙用户列表
export function getUserWallList(params) {
  return axiosClient.post('admin/UserScreenUpload/getListByParam', params);
}

// 获取上墙用户详情
export function getUserWallDetail(params) {
  return axiosClient.post('admin/UserScreenUpload/getUserScreenUploadInfo', params);
}

// 审核上墙用户
export function updateUserWallDetail(params) {
  return axiosClient.post('admin/UserScreenUpload/getUserScreenUploadUpdate', params)
}
