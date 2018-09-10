import {
  axiosClient
} from 'common/axiosClient';

// 获取门店列表
function getStoreList(params) {
  return axiosClient.post('admin/Store/list', params)
}

// 获取门店基础信息
function getStoreDetail(params) {
  return axiosClient.post('admin/Store/detail', params)
}

// 更新门店基础信息
function updateStoreDetail(params) {
  return axiosClient.post('admin/Store/saveStoreInfo', params)
}

// 获取门店配置信息
function getStoreConfig(params) {
  return axiosClient.post('admin/Store/detailConf', params);
}

// 获取公共设施列表
function getPublicDevice(params) {
  return axiosClient.post('admin/Store/getCommunalList', params);
}

// 更新门店配置信息
function updateStoreConfig(params) {
  return axiosClient.post('admin/Store/saveStoreConfInfo', params);
}

// 文件上传
function uploadImg(params) {
  return axiosClient.post('admin/Upload/uploadBase64', params)
}

// 获取省市区
function getAreaDropDown(params) {
  return axiosClient.post('admin/Store/area', params)
}

// 获取当前省市区
function getCurrentArea(params) {
  return axiosClient.post('admin/Store/areaDetail', params);
}

// 获取店长列表
function getManagerList(params) {
  return axiosClient.post('admin/Store/ownerList', params)
}

// 门店绑定店长
function bindManagerWithStore(params) {
  return axiosClient.post('admin/Store/saveStoreManagerInfo', params)
}

// 门店上线下线
function setStoreStatus(params) {
  return axiosClient.post('manager/Store/updataStoreStatus', params);
} 

export {
  getStoreList,
  getStoreDetail,
  uploadImg,
  getStoreConfig,
  updateStoreDetail,
  getAreaDropDown,
  updateStoreConfig,
  getPublicDevice,
  getManagerList,
  bindManagerWithStore,
  setStoreStatus,
  getCurrentArea
}