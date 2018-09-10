import { axiosClient } from 'common/axiosClient';

// 获取4m测试结果列表
export function getFmResultList(params) {
  return axiosClient.post('admin/Plan/planRankFmBindList', params);
}

// 编辑4m测试结果数据
export function updateFmResult(params) {
  return axiosClient.post('admin/Plan/planRankFmBindSave', params);
} 

// 获取4m测试动作记录列表
export function getFmtestList(params) {
  return axiosClient.post('admin/Plan/planFmConfList', params);
}

// 编辑4m动作记录
export function updateFmtest(params) {
  return axiosClient.post('admin/Plan/planFmConfSave', params);
} 
