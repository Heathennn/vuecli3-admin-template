import { axiosClient } from 'common/axiosClient';

// 获取用户训练计划列表
export function getUserPlanList(params) {
  return axiosClient.post('admin/plan/trainListByParams', params);
}

// 获取用户训练计划详情
export function getUserPlanDetail(params) {
  return axiosClient.post('admin/plan/getUserCourseDetail', params);
}

// 查看定制过程
export function getCustomProcess(params) {
  return axiosClient.post('admin/plan/processRecord', params)
}