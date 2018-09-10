import {
  axiosClient
} from 'common/axiosClient';
/**
 * 获取消息列表
 * @param {int} page  页码 
 * @param {int} size  条数 
 * @param {string} beginTime 开始时间
 * @param {string} endTime 结束时间
 * @param {int} userType 1 店长  2 C端用户
 * @param {int} sendType 1 短信 2 app推送 3 系统消息  
 * @param {string} sign md5加密签名  axiosClient里处理  
 */
function getMessageList(params) {
  return axiosClient.post('admin/Operate/messageList', params);
}

// 获取消息详情
function getMessageDetail(params) {
  return axiosClient.post('admin/Operate/messageDetail', params);
}

// 群发消息
function sendMessage(params) {
  return axiosClient.post('admin/Operate/messageAdd', params);
}

export {
  getMessageList,
  getMessageDetail,
  sendMessage
}