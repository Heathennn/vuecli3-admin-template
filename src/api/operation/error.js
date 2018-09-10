import {
  axiosClient
} from 'common/axiosClient';

// 获取异常设备列表
function getErrorList(params) {
  return axiosClient.post('admin/Operate/abnormalList', params)
}

// 获取设备异常详情
function getErrorDetail(params) {
  return axiosClient.post('admin/Operate/abnormalDetail', params);
}

// 获取设备处理流
function getErrorProcessStream(params) {
  return axiosClient.post('admin/Operate/facilityFitnessList', params);
}

// 获取异常描述列表
function getErrorInfoList(params) {
  return axiosClient.post('admin/Security/getListByAbnormalId', params);
}

// 提交处理日志
function addErrorLog(params) {
  return axiosClient.post('admin/Main/handleAdd', params)
}

export {
  getErrorList,
  getErrorDetail,
  getErrorProcessStream,
  getErrorInfoList,
  addErrorLog
}
