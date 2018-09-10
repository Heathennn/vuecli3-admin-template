import {
  axiosClient
} from 'common/axiosClient';

// 根据绑定状态获取设备列表
/**
 * 
 * @param {Int} bundling 1 绑定 2 未绑定 
 * 
 */
function getDeviceList(params) {
  return axiosClient.post('admin/Equipment/listForBundling', params)
}

// 编辑设备信息(位置/备注)
function setDeviceInfo(params) {
  return axiosClient.post('admin/Equipment/saveFacilityInfo', params);
}

// 解绑设备
function unbindDevice(params) {
  return axiosClient.post('admin/Equipment/unbind', params);
}

// 绑定设备
function bindDevice(params) {
  return axiosClient.post('admin/Equipment/bind', params);
}

// 设备一键同步
function deviceSync(params) {
  return axiosClient.post('admin/Equipment/EquipmentSync', params);
}

/**
 * 在已绑设备下  根据门店和类型筛选  
 * @param {int} facilityKind  设备种类 1 运动设备 2 弱点设备 0 其他设备
 * @param {int} storeId 门店ID 
 */
function filterDeviceList(params) {
  return axiosClient.post('admin/Equipment/getFacilityInfoListByParam', params)
} 

export {
  getDeviceList,
  setDeviceInfo,
  unbindDevice,
  bindDevice,
  deviceSync,
  filterDeviceList
}