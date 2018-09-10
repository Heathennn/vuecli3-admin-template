import { axiosClient } from 'common/axiosClient';

// 获取运动周期列表
export function getTrainingCycle(params) {
  return axiosClient.post('admin/Plan/planCycleList', params);
}

// 更新运动周期列表
export function updateTrainingCycle(params) {
  return axiosClient.post('admin/Plan/planCycleSave', params);
}

// 删除运动周期
export function removeTrainingCycle(params) {
  return axiosClient.post('admin/Plan/planCycleDelete', params)
}