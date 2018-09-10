import { axiosClient } from 'common/axiosClient';

// 获取伤痛病史列表
export function getDiseaseList(params) {
  return axiosClient.post('admin/Plan/planMedicalHisList', params);
}

// 更新伤痛病史( 新增/ 修改)
export function updateDisease(params) {
  return axiosClient.post('admin/Plan/planMedicalHisSave', params);
}

// 删除伤痛病史
export function removeDisease(params) {
  return axiosClient.post('admin/Plan/planMedicalHisDelete', params);
}