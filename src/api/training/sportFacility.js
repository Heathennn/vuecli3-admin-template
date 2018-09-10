import { axiosClient } from 'common/axiosClient';

//  获取设备和部位关系
export function getSportFacility(params) {
  return axiosClient.post('admin/Plan/getFacilityBodyBind', params);
}

// 关联设备和部位
export function facilityConnectBody(params) {
  return axiosClient.post('admin/Plan/updateEquipBodyBind', params);
}