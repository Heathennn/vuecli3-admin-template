import {
  axiosClient 
} from 'common/axiosClient';

// 获取帮助列表
function getHelpList(params) {
  return axiosClient.post('admin/Serve/questionList', params);
}

// 添加帮助
function addHelp(params) {
  return axiosClient.post('admin/Serve/questionSave', params);
}

// 删除帮助
function removeHelp(params) {
  return axiosClient.post('admin/Serve/questionDetail', params);
}

export {
  getHelpList,
  addHelp,
  removeHelp
}