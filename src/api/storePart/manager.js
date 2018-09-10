import {
  axiosClient
} from 'common/axiosClient';

// 获取店长列表
function getManagerList(params) {
  return axiosClient.post('admin/Store/ownerList', params)
}

// 保存店长信息
function updateManagerInfo(params) {
  return axiosClient.post('admin/Store/ownerSave', params);
}

// 获取店长详情
function getManagerDetail(params) {
  return axiosClient.post('admin/Store/ownerDetail', params);
}

export {
  getManagerList,
  updateManagerInfo,
  getManagerDetail
}