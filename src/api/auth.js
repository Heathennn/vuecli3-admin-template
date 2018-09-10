import { axiosClient } from 'common/axiosClient';

// 登录
function login(params) {
  return axiosClient.post('admin/User/loginValid', params)
}

// 获取系统消息
function getSystemMessages(params) {
  return axiosClient.post('admin/operate/getListByUserId', params);
}

// 一键已读(根据类型)
function markAllAsRead(params) {
  return axiosClient.post('admin/Operate/readByType', params);
}

// 获取token
function getUserPermission(params) {
  return axiosClient.post('admin/Jurisdiction/getPerissionByToken', params)
}

// 获取历史消息
export function getHistoryMessage(params) {
  return axiosClient.post('admin/Main/getNoticeListByParam', params);
}

// 已读一条
export function readNotice(params) {
  return axiosClient.post('admin/store/noticeDetail', params)
}
export {
  login,
  getSystemMessages,
  markAllAsRead,
  getUserPermission
}