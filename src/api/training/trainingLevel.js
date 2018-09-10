import { axiosClient } from 'common/axiosClient';

// 获取难度等级
export function getPlanRank(params) {
  return axiosClient.post('admin/Plan/planRankList', params);
}

// 更新难度等级 (新增/修改)
export function updatePlanRank(params) {
  return axiosClient.post('admin/Plan/planRankSave', params);
}

// 删除难度等级
export function removePlanRank(params) {
  return axiosClient.post('admin/Plan/planRankDelete', params);
}