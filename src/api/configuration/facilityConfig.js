import { axiosClient } from 'common/axiosClient';

// 获取设备配置信息
export function getFacilityConfig(params) {
  return axiosClient.post('admin/Equipment/facilityList', params)
}

// 更新设备配置信息
export function updateFacilityConfig(params) {
  return axiosClient.post('admin/Equipment/facilityUpdate', params);
}

// 获取单位列表
export function getUnitList(params) {
  return axiosClient.post('admin/Equipment/unitConf', params);
} 