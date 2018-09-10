import { axiosClient } from 'common/axiosClient';

// 获取训练类型列表
export function getTrainingTypeList(params) {
  return axiosClient.post('admin/Plan/planTypeList', params)
} 

// 获取训练部位对应的列表
export function getTrainingPartList(params) {
  return axiosClient.post('admin/Plan/planBodyTypeList', params)
}

// 更新训练类型 ( 新增+修改 ) [id] 
export function updateTrainingType(params) {
  return axiosClient.post('admin/Plan/planTypeSave', params)
}

// 删除训练类型
export function removeTrainingType(params) {
  return axiosClient.post('admin/Plan/planTypeDelete', params);
}

// 删除训练部位计划
export function removeTrainingPartPlan(params) {
  return axiosClient.post('admin/Plan/planBodyTypeDelete', params)
}

// 更新训练部位计划 (新增+修改)
export function updateTrainingPartPlan(params) {
  return axiosClient.post('admin/Plan/planBodyTypeSave', params)
}

// 训练类型下强度配置
export function getTrainingTypeDifficulty(params) {
  return axiosClient.post('admin/Plan/getListByPlanType', params)
}

// 上报训练强度和训练目标
export function updateTrainingTypeDifficulty(params) {
  return axiosClient.post('admin/Plan/uploadRankTrainConf', params)
}

// 训练部位计划里课程内容列表(弹出框)
export function getCoursesAll(params) {
  return axiosClient.post('admin/Plan/getPlanCourseByParam', params)
}

// 获取课程列表
export function getTrainingCourseList(params) {
  return axiosClient.post('admin/Plan/getCourseByBodyType', params)
}

// 训练计划绑定课程
export function updatePlanCourseBind(params) {
  return axiosClient.post('admin/Plan/uploadBodyTypeCourseBind', params)
}

// 删除训练计划下的课程
export function removePlanCourse(params) {
  return axiosClient.post('admin/Plan/deleteCourse', params);
}