import { axiosClient } from 'common/axiosClient';

// 获取课程库
export function getCourseList(params) {
  return axiosClient.post('admin/Plan/getPlanCourseByParam', params);
}

// 获取课程详情
export function getCourseDetail(params) {
  return axiosClient.post('admin/Plan/getCourseDetail', params);
}

// 拉伸列表
export function getStretchList(params) {
  return axiosClient.post('admin/Plan/planStretchExerciseList', params)
} 

// 编辑拉伸运动
export function updateStretchList(params) {
  return axiosClient.post('admin/Plan/planStretchExerciseSave', params)
}

// 删除拉伸运动
export function removeStretchList(params) {
  return axiosClient.post('admin/Plan/planStretchExerciseDelete', params)
}

// 新建课程
export function updatePlanCourse(params) {
  return axiosClient.post('admin/Plan/uploadPlanCourse', params);
}

// 删除课程
export function removePlanCourse(params) {
  return axiosClient.post('admin/Plan/deletePlanCourse', params)
}