import {
  axiosClient
} from 'common/axiosClient';

// 获取用户反馈列表
function getFeedbackList(params) {
  return axiosClient.post('admin/Serve/feedbackList', params)
}

// 获取故障上报列表
function getUploadErrorList(params) {
  return axiosClient.post('admin/Operate/abnormalDeclareList', params)
}

// 获取用户反馈详情
function getFeedbackDetail(params) {
  return axiosClient.post('admin/Serve/feedbackDetail', params);
}

// 获取故障上报详情
function getUploadErrorDetail(params) {
  return axiosClient.post('admin/Operate/abnormalDeclareDetail', params);
}

// 修改用户反馈状态
function updateFeedbackStatus(params) {
  return axiosClient.post('admin/security/userFeedback', params)
}

// 修改故障上报反馈状态
function updateUploadErrorStatus(params) {
  return axiosClient.post('manager/order/abnormalDeclareUpdate', params)
}

export {
  getFeedbackList,
  getUploadErrorList,
  getFeedbackDetail,
  getUploadErrorDetail,
  updateFeedbackStatus,
  updateUploadErrorStatus
}
