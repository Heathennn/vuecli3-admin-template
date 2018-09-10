import { axiosClient } from 'common/axiosClient';

// 获取公共设施列表
function getStoreConfigPublicDevice(params) {
  return axiosClient.post('admin/Store/getCommunalList', params)
}

// 更新公共设施信息
function updateStoreConfigPublicDevice(params) {
  return axiosClient.post('admin/Store/saveCommunal', params)
}

export {
  getStoreConfigPublicDevice,
  updateStoreConfigPublicDevice
}