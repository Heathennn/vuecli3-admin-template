import { axiosClient } from 'common/axiosClient';

// 获取部位列表
export function getTrainingParts(params) {
  return axiosClient.post('admin/Plan/planBodyList', params)
}

// 更新部位
export function updateTrainingParts(params) {
  return axiosClient.post('admin/Plan/planBodySave', params);
}

// 删除部位
export function removeTrainingParts(params) {
  return axiosClient.post('admin/Plan/planBodyDelete', params);
}