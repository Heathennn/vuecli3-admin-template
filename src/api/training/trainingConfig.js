import { axiosClient } from 'common/axiosClient';

// 修改训练计划配置
export function updateTrainingConfig(params) {
  return axiosClient.post('admin/Plan/baseConfig', params);
}

// 获取训练计划配置
export function getTrainingConfig(params) {
  return axiosClient.post('admin/Plan/baseInfo', params)
}