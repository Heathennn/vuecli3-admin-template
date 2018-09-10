import { axiosClient } from 'common/axiosClient';

// 获取疲劳列表
export function getFatigueList(params) {
  return axiosClient.post('admin/Plan/tiredList', params)
}

// 获取疲劳评价影响列表
export function getFatigueLevelAffectList(params) {
  return axiosClient.post('admin/Plan/getTiredAffectList', params);
} 

// 更新疲劳名
export function updateFatigueName(params) {
  return axiosClient.post('admin/Plan/tiredUpdate', params)
}

// 删除疲劳等级
export function removeFatigue(params) {
  return axiosClient.post('admin/Plan/tiredDelete', params)
}

// 上传疲劳评价影响
export function updateFatigueAffect(params) {
  return axiosClient.post('admin/Plan/uploadTiredAffect', params)
}

// 获取疲劳评价阈值
export function getFatigueThresholdList(params) {
  return axiosClient.post('admin/plan/thresholdList', params);
}

// 更新疲劳评价阈值
export function updateThresholdConfig(params) {
  return axiosClient.post('admin/plan/uploadEquipThreshold', params);
}